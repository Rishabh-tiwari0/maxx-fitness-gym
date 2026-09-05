/**
 * One-time import script: reads members.json and writes each record into
 * the Firestore "members" collection, using memberId as the document ID.
 *
 * Usage:
 *   1. Place members.json in the same folder as this script (or adjust the
 *      path below).
 *   2. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and
 *      FIREBASE_PRIVATE_KEY are set (e.g. run with `node --env-file=.env.local`,
 *      or export them in your shell first).
 *   3. Run: node import-members.mjs
 *
 * Requires: npm install firebase-admin
 */

import { readFile } from "node:fs/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// .env values sometimes include surrounding quotes; strip them if present.
const _rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = _rawPrivateKey
  ? _rawPrivateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n")
  : undefined;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, " +
      "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY before running this script.",
  );
}

const app = initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});
const db = getFirestore(app);
// Force REST transport instead of gRPC. Many networks/firewalls/antivirus
// tools silently block or break gRPC's long-lived HTTP/2 connections, which
// surfaces as a vague "5 NOT_FOUND" from the Firestore Admin SDK even though
// credentials, project ID, and IAM roles are all correct.
db.settings({ preferRest: true });

/**
 * Parse a "DD Mon YYYY" string (e.g. "27 Apr 2024") into a Firestore Timestamp.
 * Returns null if the input is missing or unparseable.
 */
function parseDateToTimestamp(dateStr) {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  return Timestamp.fromDate(parsed);
}

async function main() {
  const raw = await readFile(
    new URL("./members.json", import.meta.url),
    "utf-8",
  );
  const members = JSON.parse(raw);

  console.log(`Importing ${members.length} members...`);

  // Firestore batches are capped at 500 writes each.
  const BATCH_SIZE = 450;
  let imported = 0;

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const chunk = members.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const member of chunk) {
      const docId = String(member.memberId);
      const docRef = db.collection("members").doc(docId);

      batch.set(docRef, {
        memberId: member.memberId,
        name: member.name,
        mobile: member.mobile,
        age: member.age,
        gender: member.gender,
        memberAdded: parseDateToTimestamp(member.memberAdded),
        email: member.email,
        planName: member.planName,
        planAmount: member.planAmount,
        paid: member.paid,
        pendingAmount: member.pendingAmount,
        purchaseDate: parseDateToTimestamp(member.purchaseDate),
        expiryDate: parseDateToTimestamp(member.expiryDate),
      });
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  ${imported}/${members.length} written`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
