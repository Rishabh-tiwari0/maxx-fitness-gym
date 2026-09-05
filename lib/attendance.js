/**
 * Compute the attendance percentage for a set of records.
 * @param {{ present: boolean }[]} records
 * @returns {number} whole-number percentage
 */
export function computeAttendanceRate(records) {
  if (records.length === 0) return 0;
  const presentCount = records.filter((record) => record.present).length;
  return Math.round((presentCount / records.length) * 100);
}
