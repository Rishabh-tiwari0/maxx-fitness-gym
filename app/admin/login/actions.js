"use server";

import { createSession, clearSession } from "@/lib/session";

/**
 * Called from the login page after Firebase Auth's
 * signInWithEmailAndPassword succeeds in the browser. Exchanges the
 * short-lived ID token for a long-lived httpOnly session cookie.
 */
export async function createSessionAction(idToken) {
  try {
    await createSession(idToken);
    return { success: true };
  } catch (error) {
    console.error("createSessionAction failed:", error);
    return { success: false, error: "Could not start session. Try again." };
  }
}

export async function logoutAction() {
  await clearSession();
}
