import "server-only";
import { unstable_cache } from "next/cache";
import { AggregateField, Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalMembers
 * @property {number} activeMembers
 * @property {number} expiringSoon   - active but expiring within 7 days
 * @property {number} totalPending   - sum of pendingAmount across all members
 */

// Firestore aggregation queries: COUNT and SUM each cost 1 read per 1000 docs
// (rounded up), so with 816 members each query = 1 read.
// 4 queries here = 4 reads total, vs 816 reads from getAllMembers().
// Cached 5 minutes and tagged "stats" — bust with revalidateTag("stats")
// on every mutation (add/edit/delete member, record payment).
const getDashboardStatsCached = unstable_cache(
  async () => {
    const now = Timestamp.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const soonTs = Timestamp.fromDate(new Date(Date.now() + sevenDaysMs));

    const [totalSnap, activeSnap, expiringSoonSnap, pendingSnap] =
      await Promise.all([
        // 1 read: total member count
        adminDb.collection("members").count().get(),
        // 1 read: members whose membership hasn't expired yet
        adminDb
          .collection("members")
          .where("expiryDate", ">", now)
          .count()
          .get(),
        // 1 read: active but expiring within 7 days
        adminDb
          .collection("members")
          .where("expiryDate", ">", now)
          .where("expiryDate", "<=", soonTs)
          .count()
          .get(),
        // 1 read: sum of all pending amounts
        adminDb
          .collection("members")
          .aggregate({ total: AggregateField.sum("pendingAmount") })
          .get(),
      ]);

    return {
      totalMembers: totalSnap.data().count ?? 0,
      activeMembers: activeSnap.data().count ?? 0,
      expiringSoon: expiringSoonSnap.data().count ?? 0,
      totalPending: pendingSnap.data().total ?? 0,
    };
  },
  ["dashboard-stats"],
  { revalidate: 300, tags: ["stats"] },
);

/** @returns {Promise<DashboardStats>} */
export async function getDashboardStats() {
  return getDashboardStatsCached();
}
