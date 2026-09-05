import "server-only";

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

/**
 * Convert a Firestore Timestamp (or null) into a plain ISO date string so it
 * can cross the Server Component -> Client Component boundary as serializable
 * data. Firestore Timestamp instances are not plain objects and cannot be
 * passed as props to a "use client" component.
 * @param {import("firebase-admin/firestore").Timestamp|null|undefined} timestamp
 * @returns {string|null}
 */
function timestampToISO(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return null;
  return timestamp.toDate().toISOString();
}

/**
 * Convert a raw Firestore document snapshot into a plain, serializable
 * Member object.
 * @param {FirebaseFirestore.QueryDocumentSnapshot} doc
 * @returns {Member}
 */
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

/**
 * Fetch every member, ordered by name. Search and pagination are done
 * client-side in the view component — the collection is small enough
 * (low thousands at most) that this is simpler and cheaper than
 * implementing prefix-search + cursor pagination against Firestore, which
 * has no native full-text/substring search.
 * @returns {Promise<Member[]>}
 */
export async function getAllMembers() {
  const snapshot = await adminDb.collection("members").orderBy("name").get();
  return snapshot.docs.map(toMember);
}

/**
 * Fetch a single member by their document ID (the memberId).
 * @param {string} memberId
 * @returns {Promise<Member|null>}
 */
export async function getMemberById(memberId) {
  const doc = await adminDb.collection("members").doc(memberId).get();
  if (!doc.exists) return null;
  return toMember(doc);
}

/**
 * Permanently delete a member document. Does NOT delete related
 * payments/attendance records or the member's Storage photo — those are
 * left behind intentionally until a cascade-delete policy is decided.
 * @param {string} memberId
 * @returns {Promise<void>}
 */
export async function deleteMember(memberId) {
  await adminDb.collection("members").doc(memberId).delete();
}
