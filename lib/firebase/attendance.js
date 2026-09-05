import "server-only";

import { adminDb } from "@/lib/firebase/admin";

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} memberId
 * @property {string} date - "yyyy-mm-dd"
 * @property {string|null} checkInTime - ISO datetime string
 * @property {string|null} markedBy - admin email who marked it
 */

function toAttendanceRecord(doc) {
  const data = doc.data();
  return {
    memberId: data.memberId,
    date: data.date,
    checkInTime: data.checkInTime ?? null,
    markedBy: data.markedBy ?? null,
  };
}

/**
 * Fetch every attendance record for a single ISO date ("yyyy-mm-dd").
 * @param {string} isoDate
 * @returns {Promise<AttendanceRecord[]>}
 */
export async function getAttendanceForDate(isoDate) {
  const snapshot = await adminDb
    .collection("attendance")
    .where("date", "==", isoDate)
    .get();
  return snapshot.docs.map(toAttendanceRecord);
}

/**
 * Count how many days a member was marked present within an ISO month
 * ("yyyy-mm"). NOTE: this needs a Firestore composite index on
 * (memberId ASC, date ASC) — the first time it runs, Firestore will throw
 * an error in the server console with a direct link to auto-create it.
 * @param {string} memberId
 * @param {string} isoMonth - "yyyy-mm"
 * @returns {Promise<number>}
 */
export async function getMonthlyAttendanceCount(memberId, isoMonth) {
  const start = `${isoMonth}-01`;
  const end = `${isoMonth}-31`; // safe upper bound for ISO string comparison
  const snapshot = await adminDb
    .collection("attendance")
    .where("memberId", "==", memberId)
    .where("date", ">=", start)
    .where("date", "<=", end)
    .get();
  return snapshot.size;
}
