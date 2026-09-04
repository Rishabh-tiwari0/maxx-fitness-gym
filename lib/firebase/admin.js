import "server-only";

/**
 * Firebase Admin SDK — SERVER ONLY. Import this only from Server Actions,
 * Route Handlers, or Server Components. The "server-only" import above
 * makes Next.js throw a build error if this ever gets pulled into a
 * client bundle, as a safety net.
 *
 * Requires these env vars (from your service account JSON — see
 * .env.example):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys are stored with literal \n escapes in most env systems —
  // convert them back to real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local."
    );
  }

  return { projectId, clientEmail, privateKey };
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(getServiceAccount()) });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export default adminApp;
