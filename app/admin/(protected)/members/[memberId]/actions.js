"use server";

import { revalidatePath } from "next/cache";

import { deleteMember } from "@/lib/firebase/members";
import { getSessionUser } from "@/lib/session";

/**
 * Permanently deletes a member. Re-checked here (not just relying on the
 * protected layout) because Server Actions are callable independently of
 * page rendering.
 * @param {string} memberId
 */
export async function deleteMemberAction(memberId) {
  const user = await getSessionUser();
  if (!user) {
    return {
      success: false,
      error: "Your session expired. Please log in again.",
    };
  }

  try {
    await deleteMember(memberId);
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    console.error("deleteMemberAction failed:", error);
    return { success: false, error: "Could not delete member. Try again." };
  }
}
