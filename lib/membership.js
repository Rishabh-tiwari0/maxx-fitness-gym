/**
 * Single source of truth for membership status. Used by the dashboard,
 * the members grid, and the member detail page — don't recompute this
 * inline elsewhere, or the three views will drift out of sync.
 */

/**
 * Parse a member date field, which may arrive as a Firestore Timestamp
 * (has .toDate()), an ISO string, or null.
 * @param {*} value
 * @returns {Date|null}
 */
export function parseDateValue(value) {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

/**
 * @param {{ expiryDate?: * }} member
 * @returns {boolean}
 */
export function isMembershipExpired(member) {
  const expiry = parseDateValue(member.expiryDate);
  if (!expiry) return false;
  return expiry.getTime() < Date.now();
}

/**
 * @param {{ pendingAmount?: number }} member
 * @returns {boolean}
 */
export function hasPendingDues(member) {
  return Number(member.pendingAmount ?? 0) > 0;
}

/**
 * @param {{ expiryDate?: *, pendingAmount?: number }} member
 * @param {number} [expiringSoonDays]
 * @returns {boolean}
 */
export function isExpiringSoon(member, expiringSoonDays = 7) {
  const expiry = parseDateValue(member.expiryDate);
  if (!expiry) return false;
  const diffDays = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= expiringSoonDays;
}

/**
 * Overall membership status for badges/summary counts.
 * A lapsed membership is more urgent than an outstanding balance, so an
 * expired member is reported as "expired" even if they also owe money —
 * check hasPendingDues() separately if you need both facts at once.
 * @param {{ expiryDate?: *, pendingAmount?: number }} member
 * @returns {"active"|"pending"|"expired"}
 */
export function getMembershipStatus(member) {
  if (isMembershipExpired(member)) return "expired";
  if (hasPendingDues(member)) return "pending";
  return "active";
}
