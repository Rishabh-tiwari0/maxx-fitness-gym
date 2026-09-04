import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/**
 * Verify a Firebase ID token (from client-side signInWithEmailAndPassword)
 * and set it as an httpOnly session cookie. Call from a Server Action.
 */
export async function createSession(idToken) {
  // Reject tokens older than 5 minutes to limit replay risk.
  await adminAuth.verifyIdToken(idToken, true);

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_EXPIRES_IN_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

/** Clear the session cookie. Call from a Server Action on logout. */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Read + verify the session cookie. Returns the decoded claims (including
 * uid, email) if valid, or null if missing/expired/tampered. Safe to call
 * from Server Components (e.g. the protected admin layout) and Server
 * Actions alike.
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // `true` = check the session was not revoked (e.g. after a password
    // change or manual revocation) — costs one extra Admin API call.
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
