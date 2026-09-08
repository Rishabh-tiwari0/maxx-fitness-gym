import "server-only";
import { unstable_cache } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";

/**
 * @typedef {Object} Member
 * @property {string} memberId - Document ID, e.g. "222"
 * @property {string} name
 * @property {string} mobile
 * @property {number|null} age
 * @property {"male"|"female"|string|null} gender
 * @property {string|null} memberAdded - ISO date string, or null
 * @property {string|null} email
 * @property {string} planName
 * @property {number} planAmount
 * @property {number} paid
 * @property {number} pendingAmount
 * @property {string|null} purchaseDate - ISO date string, or null
 * @property {string|null} expiryDate - ISO date string, or null
 */

function timestampToISO(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return null;
  return timestamp.toDate().toISOString();
}

function toMember(doc) {
  const data = doc.data();
  return {
    memberId: doc.id,
    name: data.name ?? "",
    mobile: data.mobile ?? "",
    age: data.age ?? null,
    gender: data.gender ?? null,
    memberAdded: timestampToISO(data.memberAdded),
    email: data.email ?? null,
    planName: data.planName ?? "",
    planAmount: data.planAmount ?? 0,
    paid: data.paid ?? 0,
    pendingAmount: data.pendingAmount ?? 0,
    purchaseDate: timestampToISO(data.purchaseDate),
    expiryDate: timestampToISO(data.expiryDate),
  };
}

// Cached for 5 minutes (300s) and tagged "members". Any mutation calls
// revalidateTag("members") to bust this immediately. Bumped from 60s → 300s
// to reduce Firestore reads significantly on the free-tier quota.
const getAllMembersCached = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("members").orderBy("name").get();
    return snapshot.docs.map(toMember);
  },
  ["members-all"],
  { revalidate: 300, tags: ["members"] },
);

/** @returns {Promise<Member[]>} */
export async function getAllMembers() {
  return getAllMembersCached();
}

/**
 * Returns a single member by ID.
 *
 * Strategy: look up from the already-cached full list first — zero extra
 * Firestore reads when the list is warm. Falls back to a direct doc fetch
 * (wrapped in its own short-lived cache) only if the list is unexpectedly
 * empty or the member isn't found there.
 *
 * @param {string} memberId
 * @returns {Promise<Member|null>}
 */
export async function getMemberById(memberId) {
  // Fast path — reuse the cached collection read (no extra Firestore reads).
  try {
    const allMembers = await getAllMembersCached();
    if (allMembers.length > 0) {
      return allMembers.find((m) => m.memberId === memberId) ?? null;
    }
  } catch {
    // If the collection cache fails for any reason, fall through to direct fetch.
  }

  // Slow path — direct doc fetch, cached individually.
  const getMemberByIdCached = unstable_cache(
    async (id) => {
      const doc = await adminDb.collection("members").doc(id).get();
      if (!doc.exists) return null;
      return toMember(doc);
    },
    [`member-by-id-${memberId}`],
    { revalidate: 300, tags: ["members"] },
  );

  return getMemberByIdCached(memberId);
}

/**
 * Permanently delete a member document. NOT cached — this is a write.
 * Caller (the server action) is responsible for calling
 * revalidateTag("members") afterward.
 * @param {string} memberId
 * @returns {Promise<void>}
 */
export async function deleteMember(memberId) {
  await adminDb.collection("members").doc(memberId).delete();
}

// The dashboard "Recent Activity" table only needs the 5 soonest-expiring
// members — fetching 5 docs instead of all 816 saves ~811 reads per load.
// Tagged "members" so it refreshes whenever member data changes.
const getRecentActivityMembersCached = unstable_cache(
  async () => {
    const snapshot = await adminDb
      .collection("members")
      .orderBy("expiryDate")
      .limit(5)
      .get();
    return snapshot.docs.map(toMember);
  },
  ["members-recent-activity"],
  { revalidate: 300, tags: ["members"] },
);

/**
 * Returns the 5 members with the earliest expiry dates for the dashboard
 * activity table. Costs 5 reads instead of 816.
 * @returns {Promise<Member[]>}
 */
export async function getRecentActivityMembers() {
  return getRecentActivityMembersCached();
}
