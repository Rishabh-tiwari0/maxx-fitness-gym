import { brand, location } from "@/data/site-data";

/**
 * Formats a date string or ISO value into a human-readable label.
 * e.g. "Sep 8, 2026"
 * @param {string|null|undefined} value
 */
function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Capitalises first letter of a payment method label.
 * @param {string} method
 */
function fmtMethod(method) {
  if (!method) return "—";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

/**
 * Builds the WhatsApp-formatted receipt text.
 * WhatsApp renders *text* as bold.
 *
 * @param {{
 *   memberName: string,
 *   memberId: string,
 *   mobile: string,
 *   planName: string,
 *   amountPaid: number,
 *   method: string,
 *   paidAt: string,       // ISO date string
 *   validUntil?: string,  // ISO date string, optional
 *   pendingAmount: number,
 * }} data
 * @returns {string}
 */
export function buildReceiptText({
  memberName,
  memberId,
  mobile,
  planName,
  amountPaid,
  method,
  paidAt,
  validUntil,
  pendingAmount,
}) {
  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━";
  const lines = [
    divider,
    `🏋️ *${brand.name.toUpperCase()}*`,
    `📍 _${location.city}_`,
    `📞 *Contact:* ${brand.phone}`,
    divider,
    "",
    "🧾 *OFFICIAL PAYMENT RECEIPT*",
    "",
    "*Member Details:*",
    `• *Name:* ${memberName}`,
    `• *Member ID:* #${memberId}`,
    `• *Mobile:* ${mobile}`,
    "",
    "*Payment Summary:*",
    `• *Plan:* ${planName}`,
    `• *Amount Paid:* *₹${amountPaid.toLocaleString("en-IN")}*`,
    `• *Payment Mode:* ${fmtMethod(method)}`,
    `• *Date:* ${fmtDate(paidAt)}`,
  ];

  if (validUntil) {
    lines.push(`• *Valid Until:* ${fmtDate(validUntil)}`);
  }

  lines.push("");

  if (pendingAmount > 0) {
    lines.push("*Status:* ⚠️ Partial Payment");
    lines.push(`• *Balance Due:* *₹${pendingAmount.toLocaleString("en-IN")}*`);
  } else {
    lines.push("*Status:* ✅ *Paid in Full* (No Dues)");
  }

  lines.push(
    "",
    "────────────────────────",
    "Thank you for training with us! 💪",
    "_Stay consistent, stay strong!_",
    divider,
  );

  return lines.join("\n");
}

/**
 * Normalises an Indian mobile number to the international format expected
 * by wa.me (country code without +), e.g. "9170703898" → "919170703898".
 * If the number already starts with 91 and has 12 digits, it's left alone.
 * @param {string} mobile
 * @returns {string}
 */
function normaliseIndianMobile(mobile) {
  // Strip all non-digits.
  const digits = mobile.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;
  // Fallback: return as-is (handles +91… that became 91… after stripping).
  return digits;
}

/**
 * Returns the wa.me URL that opens WhatsApp with the receipt pre-filled.
 * @param {string} mobile
 * @param {string} text
 * @returns {string}
 */
export function buildWhatsAppUrl(mobile, text) {
  const phone = normaliseIndianMobile(mobile);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
