/**
 * Deterministic mock attendance generation.
 *
 * Real check-in data will come from an API keyed by date. Until that exists,
 * we derive a stable, repeatable attendance record for any date + member
 * pair from a seeded pseudo-random number generator, so the same date
 * always renders the same table (no backend required) and "today" always
 * works no matter when this app is opened.
 */

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} id - Member id, matches Member.id in data/attendance-data.js
 * @property {string} name
 * @property {string} initials
 * @property {string} memberCode - Display code, e.g. "MX-2041"
 * @property {boolean} present
 * @property {string|null} checkInTime - e.g. "05:45 AM", or null if absent
 */

/**
 * Hash a string into a 32-bit unsigned integer seed.
 * @param {string} str
 * @returns {number}
 */
function hashSeed(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 seeded PRNG - returns a function producing floats in [0, 1).
 * @param {number} seed
 * @returns {() => number}
 */
function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate the attendance table for a given ISO date and member roster.
 * @param {string} isoDate - "yyyy-mm-dd"
 * @param {import("../data/attendance-data").Member[]} members
 * @returns {AttendanceRecord[]}
 */
export function generateAttendanceForDate(isoDate, members) {
  return members.map((member) => {
    const rng = mulberry32(hashSeed(`${isoDate}:${member.id}`));
    const present = rng() < 0.85;
    if (!present) {
      return {
        id: member.id,
        name: member.name,
        initials: member.initials,
        memberCode: member.memberCode,
        present: false,
        checkInTime: null,
      };
    }
    const totalMinutes = Math.floor(5 * 60 + rng() * 270); // 5:00 AM - 9:30 AM
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const checkInTime = `${String(hour12).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")} ${period}`;
    return {
      id: member.id,
      name: member.name,
      initials: member.initials,
      memberCode: member.memberCode,
      present: true,
      checkInTime,
    };
  });
}

/**
 * Compute the attendance percentage for a set of records.
 * @param {AttendanceRecord[]} records
 * @returns {number} whole-number percentage
 */
export function computeAttendanceRate(records) {
  if (records.length === 0) return 0;
  const presentCount = records.filter((record) => record.present).length;
  return Math.round((presentCount / records.length) * 100);
}
