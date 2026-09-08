"use server";

import { revalidateTag } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/session";

/**
 * Records an offline payment: updates the member's running totals and
 * writes a payments audit record atomically in one batch (previously these
 * were two independent client-side writes, so a mid-flow failure could
 * leave them inconsistent), then busts the "members" cache tag so
 * getAllMembers/getMemberById reflect the new balance immediately.
 * @param {{
 *   memberId: string, memberName: string, currentPaid: number,
 *   currentPending: number, amount: number, method: string,
 * }} input
 */
export async function recordPaymentAction({
  memberId,
  memberName,
  currentPaid,
  currentPending,
  amount,
  method,
}) {
  const user = await getSessionUser();
  if (!user) {
    return {
      success: false,
      error: "Your session expired. Please log in again.",
    };
  }

  if (!memberId || !amount || amount <= 0) {
    return { success: false, error: "Invalid payment details." };
  }

  const newPaid = (currentPaid ?? 0) + amount;
  const newPendingAmount = Math.max(0, (currentPending ?? 0) - amount);

  try {
    const batch = adminDb.batch();

    batch.update(adminDb.collection("members").doc(memberId), {
      paid: newPaid,
      pendingAmount: newPendingAmount,
    });

    batch.set(adminDb.collection("payments").doc(), {
      memberId,
      memberName,
      amount,
      method,
      recordedAt: Timestamp.now(),
    });

    await batch.commit();
    revalidateTag("members");

    return { success: true, paid: newPaid, pendingAmount: newPendingAmount };
  } catch (error) {
    console.error("recordPaymentAction failed:", error);
    return { success: false, error: "Could not record payment. Try again." };
  }
}
