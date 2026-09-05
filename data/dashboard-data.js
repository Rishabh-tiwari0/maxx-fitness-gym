/**
 * @typedef {Object} StatCard
 * @property {string} id
 * @property {string} label
 * @property {string} value - Pre-formatted display value, e.g. "1,872"
 * @property {"none"|"warning"|"danger"} accent - Left border / emphasis color
 * @property {"bolt"|null} icon - Optional icon key rendered top-right
 */

/**
 * @typedef {Object} MemberActivity
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} plan
 * @property {string} dueDate - ISO "yyyy-mm-dd"
 * @property {"active"|"pending"|"expired"} status
 */

export const dashboardStats = /** @type {StatCard[]} */ ([
  {
    id: "total-members",
    label: "TOTAL MEMBERS",
    value: "1,872",
    accent: "none",
    icon: null,
  },
  {
    id: "active",
    label: "ACTIVE",
    value: "1,340",
    accent: "none",
    icon: "bolt",
  },
  {
    id: "expiring-soon",
    label: "EXPIRING SOON",
    value: "67",
    accent: "warning",
    icon: null,
  },
  {
    id: "pending-amount",
    label: "PENDING AMOUNT",
    value: "$2,340",
    accent: "danger",
    icon: null,
  },
  {
    id: "monthly-collection",
    label: "MONTHLY COLLECTION",
    value: "$48,960",
    accent: "none",
    icon: null,
  },
]);

export const recentMemberActivity = /** @type {MemberActivity[]} */ ([
  {
    id: "m-1001",
    name: "Tomás Delgado",
    phone: "718-0342",
    plan: "Pro Tier",
    dueDate: "2026-09-18",
    status: "pending",
  },
  {
    id: "m-1002",
    name: "Priya Sharma",
    phone: "718-0561",
    plan: "Elite",
    dueDate: "2026-09-22",
    status: "active",
  },
  {
    id: "m-1003",
    name: "Jordan Mills",
    phone: "718-0899",
    plan: "Basic",
    dueDate: "2026-09-10",
    status: "pending",
  },
  {
    id: "m-1004",
    name: "Lena Voss",
    phone: "718-0214",
    plan: "Elite",
    dueDate: "2026-10-05",
    status: "active",
  },
  {
    id: "m-1005",
    name: "Arjun Nair",
    phone: "718-0733",
    plan: "Basic",
    dueDate: "2026-08-29",
    status: "expired",
  },
]);
