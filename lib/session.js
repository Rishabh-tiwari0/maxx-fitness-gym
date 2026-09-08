import "server-only";

import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
const REVOCATION_CHECK_SECONDS = 3 * 24 * 60 * 60; // 3 days

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

// Network-backed check: has this exact session cookie been revoked (password
// change, manual revoke, disabled account)? This is the expensive call, so
// it's wrapped in Next's data cache and only actually reaches Firebase Auth
// once every 3 days for a given session cookie — every other call in that
// window is served from cache. A brand-new session (new login) gets a fresh
// cache entry automatically, since the cookie value itself changes.
const checkNotRevoked = unstable_cache(
  async (sessionCookie) => {
    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
      return true;
    } catch {
      return false;
    }
  },
  ["session-revocation-check"],
  { revalidate: REVOCATION_CHECK_SECONDS },
);

/**
 * Read + verify the session cookie. Returns the decoded claims (including
 * uid, email) if valid, or null if missing/expired/tampered/revoked.
 * Safe to call from Server Components and Server Actions alike.
 *
 * Two-tier check:
 * 1. Local signature + expiry verification (checkRevoked: false) — this is
 *    stateless, done against Google's public keys, no network call. Runs
 *    on every single call, cheaply.
 * 2. Revocation check against Firebase Auth — only actually hits the
 *    network once every 3 days per session (see checkNotRevoked above).
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  let claims;
  try {
    claims = await adminAuth.verifySessionCookie(sessionCookie, false);
  } catch {
    return null;
  }

  const notRevoked = await checkNotRevoked(sessionCookie);
  if (!notRevoked) {
    return null;
  }

  return claims;
}
