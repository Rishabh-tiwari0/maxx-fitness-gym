import "server-only";
import { unstable_cache } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} memberId
 * @property {string} date - "yyyy-mm-dd"
 * @property {string|null} checkInTime - ISO datetime string
 * @property {string|null} markedBy
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

// Short 30s cache — today's attendance changes throughout the day as
// people check in, so this window is intentionally tighter than the
// members cache. This mainly saves reads from repeated page loads
// within the same minute (dev hot-reloads, staff refreshing the page),
// not from the live client-side toggle writes, which bypass this
// entirely and read/write Firestore directly for immediate correctness.
const getAttendanceForDateCached = unstable_cache(
  async (isoDate) => {
    const snapshot = await adminDb
      .collection("attendance")
      .where("date", "==", isoDate)
      .get();
    return snapshot.docs.map(toAttendanceRecord);
  },
  ["attendance-for-date"],
  { revalidate: 30, tags: ["attendance"] },
);

/**
 * @param {string} isoDate
 * @returns {Promise<AttendanceRecord[]>}
 */
export async function getAttendanceForDate(isoDate) {
  return getAttendanceForDateCached(isoDate);
}

const getMonthlyAttendanceCountCached = unstable_cache(
  async (memberId, isoMonth) => {
    const start = `${isoMonth}-01`;
    const end = `${isoMonth}-31`;
    const snapshot = await adminDb
      .collection("attendance")
      .where("memberId", "==", memberId)
      .where("date", ">=", start)
      .where("date", "<=", end)
      .get();
    return snapshot.size;
  },
  ["attendance-monthly-count"],
  { revalidate: 60, tags: ["attendance"] },
);

/**
 * @param {string} memberId
 * @param {string} isoMonth - "yyyy-mm"
 * @returns {Promise<number>}
 */
export async function getMonthlyAttendanceCount(memberId, isoMonth) {
  return getMonthlyAttendanceCountCached(memberId, isoMonth);
}
