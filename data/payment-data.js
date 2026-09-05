/**
 * Ways staff can note how an offline payment was collected. There's no
 * payment gateway wired up — every option here still means "handed to /
 * confirmed by staff in person", this just records which channel it came
 * through for the books.
 */
export const paymentMethods =
  /** @type {{ id: "cash"|"card"|"upi", label: string }[]} */ ([
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "upi", label: "UPI" },
  ]);
