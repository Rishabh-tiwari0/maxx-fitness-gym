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

// Cached for 60s and tagged "members" — any page that renders within that
// window reuses this result instead of hitting Firestore again. A mutation
// (delete, a future edit action) calls revalidateTag("members") to bust
// this immediately rather than waiting out the window.
const getAllMembersCached = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("members").orderBy("name").get();
    return snapshot.docs.map(toMember);
  },
  ["members-all"],
  { revalidate: 60, tags: ["members"] },
);

/** @returns {Promise<Member[]>} */
export async function getAllMembers() {
  return getAllMembersCached();
}

const getMemberByIdCached = unstable_cache(
  async (memberId) => {
    const doc = await adminDb.collection("members").doc(memberId).get();
    if (!doc.exists) return null;
    return toMember(doc);
  },
  ["member-by-id"],
  { revalidate: 60, tags: ["members"] },
);

/**
 * @param {string} memberId
 * @returns {Promise<Member|null>}
 */
export async function getMemberById(memberId) {
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
