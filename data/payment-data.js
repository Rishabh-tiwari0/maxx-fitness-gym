/**
 * @typedef {Object} PayableMember
 * @property {string} id
 * @property {string} name
 * @property {string} memberCode - Display code, e.g. "MX-2041"
 * @property {string} plan
 * @property {number} amountDue - Suggested amount, in dollars
 */

export const paymentMembers = /** @type {PayableMember[]} */ ([
  { id: "pay-1", name: "Tomás Delgado", memberCode: "MX-0342", plan: "Pro Tier", amountDue: 79 },
  { id: "pay-2", name: "Priya Sharma", memberCode: "MX-0561", plan: "Elite", amountDue: 129 },
  { id: "pay-3", name: "Jordan Mills", memberCode: "MX-0899", plan: "Basic", amountDue: 49 },
  { id: "pay-4", name: "Lena Voss", memberCode: "MX-0214", plan: "Elite", amountDue: 129 },
  { id: "pay-5", name: "Arjun Nair", memberCode: "MX-0733", plan: "Basic", amountDue: 49 },
  { id: "pay-6", name: "Grace Kim", memberCode: "MX-1355", plan: "Pro Tier", amountDue: 79 },
  { id: "pay-7", name: "Omar Haddad", memberCode: "MX-0879", plan: "Basic", amountDue: 49 },
  { id: "pay-8", name: "Zara Malik", memberCode: "MX-1466", plan: "Elite", amountDue: 129 },
]);

export const paymentMethods = /** @type {{ id: "cash"|"card"|"online", label: string }[]} */ ([
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "online", label: "Online" },
]);
