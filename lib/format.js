/**
 * Format a number as USD currency, e.g. 1872 -> "1,872".
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a number as a currency amount, e.g. 49.99 -> "$49.99".
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Format a number as Indian Rupees, e.g. 1500 -> "₹1,500".
 * @param {number} value
 * @returns {string}
 */
export function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

/**
 * Get initials from a full name, e.g. "Rachel Liu" -> "RL".
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * Return today's date as an ISO "yyyy-mm-dd" string (local time).
 * @returns {string}
 */
export function todayISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

/**
 * Format an ISO "yyyy-mm-dd" date string as e.g. "Sep 18, 2026".
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a full ISO datetime string (e.g. a Firestore Timestamp converted
 * with .toISOString()) as e.g. "Sep 18, 2026". Returns a fallback for
 * missing/invalid input instead of throwing, since member records can have
 * null dates.
 * @param {string|null|undefined} isoDateTime
 * @param {string} [fallback]
 * @returns {string}
 */
export function formatISODateTimeLabel(isoDateTime, fallback = "—") {
  if (!isoDateTime) return fallback;
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
