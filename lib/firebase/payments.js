import "server-only";
import { unstable_cache } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

/**
 * @typedef {Object} Payment
 * @property {string} id - Document ID
 * @property {string} memberId
 * @property {string} memberName
 * @property {number} amount
 * @property {string} method
 * @property {string} recordedAt - ISO datetime string
 */

function toPayment(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    memberId: data.memberId ?? "",
    memberName: data.memberName ?? "",
    amount: Number(data.amount ?? 0),
    method: data.method ?? "",
    recordedAt: data.recordedAt?.toDate?.().toISOString() ?? null,
  };
}

function monthBounds(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
}

// Cached for 5 minutes, tagged "payments". Bust with revalidateTag("payments")
// whenever a payment is recorded so the dashboard monthly total stays accurate.
// Without this cache, every dashboard visit reads every payment doc for the month.
const getPaymentsForMonthCached = unstable_cache(
  async (year, month) => {
    const date = new Date(year, month, 1);
    const { start, end } = monthBounds(date);
    const snapshot = await adminDb
      .collection("payments")
      .where("recordedAt", ">=", start)
      .where("recordedAt", "<", end)
      .get();
    return snapshot.docs.map(toPayment);
  },
  ["payments-for-month"],
  { revalidate: 300, tags: ["payments"] },
);

/**
 * @param {Date} [date]
 * @returns {Promise<Payment[]>}
 */
export async function getPaymentsForMonth(date = new Date()) {
  return getPaymentsForMonthCached(date.getFullYear(), date.getMonth());
}

/**
 * @param {Date} [date]
 * @returns {Promise<number>}
 */
export async function getMonthlyCollectionTotal(date = new Date()) {
  const payments = await getPaymentsForMonth(date);
  return payments.reduce((sum, p) => sum + p.amount, 0);
}
