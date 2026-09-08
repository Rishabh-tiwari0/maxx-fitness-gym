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

// 2-minute cache — attendance for a given date barely changes outside
// active check-in hours, so 30s was burning reads for no benefit.
// Mutations (toggleAttendance) already call revalidateTag("attendance")
// to bust this immediately when a check-in is recorded.
const getAttendanceForDateCached = unstable_cache(
  async (isoDate) => {
    const snapshot = await adminDb
      .collection("attendance")
      .where("date", "==", isoDate)
      .get();
    return snapshot.docs.map(toAttendanceRecord);
  },
  ["attendance-for-date"],
  { revalidate: 120, tags: ["attendance"] },
);

/**
 * @param {string} isoDate
 * @returns {Promise<AttendanceRecord[]>}
 */
export async function getAttendanceForDate(isoDate) {
  return getAttendanceForDateCached(isoDate);
}

// 5-minute cache — monthly count for a past member barely changes.
// Even for the current month, a 5-minute window is fine for an attendance
// summary widget on the detail page.
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
  { revalidate: 300, tags: ["attendance"] },
);

/**
 * @param {string} memberId
 * @param {string} isoMonth - "yyyy-mm"
 * @returns {Promise<number>}
 */
export async function getMonthlyAttendanceCount(memberId, isoMonth) {
  return getMonthlyAttendanceCountCached(memberId, isoMonth);
}
