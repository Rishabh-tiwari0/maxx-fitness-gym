"use server";

import { revalidateTag } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/session";

/**
 * Creates a new member via the Admin SDK and busts the "members" cache tag
 * so the new member shows up immediately on the members list, dashboard,
 * and payment pages — instead of those pages serving a stale cached list
 * for up to 60s (see lib/firebase/members.js).
 */
export async function addMemberAction(input) {
  const user = await getSessionUser();
  if (!user) {
    return {
      success: false,
      error: "Your session expired. Please log in again.",
    };
  }

  const {
    name,
    mobile,
    age,
    gender,
    email,
    planName,
    planAmount,
    paid,
    pendingAmount,
    expiryDate,
  } = input;

  if (
    !name?.trim() ||
    !mobile?.trim() ||
    !planName?.trim() ||
    !planAmount ||
    planAmount <= 0
  ) {
    return {
      success: false,
      error: "Name, mobile, plan name, and a plan amount above 0 are required.",
    };
  }

  const now = new Date();
  const expiry = expiryDate ? new Date(expiryDate) : now;

  const record = {
    name: name.trim(),
    mobile: mobile.trim(),
    age: age ?? null,
    gender: gender || "male",
    email: email?.trim() || null,
    planName: planName.trim(),
    planAmount,
    paid: paid ?? 0,
    pendingAmount: pendingAmount ?? 0,
    memberAdded: Timestamp.fromDate(now),
    purchaseDate: Timestamp.fromDate(now),
    expiryDate: Timestamp.fromDate(expiry),
  };

  try {
    const docRef = adminDb.collection("members").doc();
    await docRef.set(record);
    revalidateTag("members");
    revalidateTag("stats");

    return {
      success: true,
      member: {
        memberId: docRef.id,
        name: record.name,
        mobile: record.mobile,
        age: record.age,
        gender: record.gender,
        email: record.email,
        planName: record.planName,
        planAmount: record.planAmount,
        paid: record.paid,
        pendingAmount: record.pendingAmount,
        memberAdded: now.toISOString(),
        purchaseDate: now.toISOString(),
        expiryDate: expiry.toISOString(),
      },
    };
  } catch (error) {
    console.error("addMemberAction failed:", error);
    return { success: false, error: "Could not save member. Try again." };
  }
}

/**
 * Updates an existing member's details via the Admin SDK and busts the
 * "members" cache tag so all pages see the changes immediately.
 * @param {string} memberId
 * @param {Object} input
 */
export async function updateMemberAction(memberId, input) {
  const user = await getSessionUser();
  if (!user) {
    return {
      success: false,
      error: "Your session expired. Please log in again.",
    };
  }

  const {
    name,
    mobile,
    age,
    gender,
    email,
    planName,
    planAmount,
    paid,
    pendingAmount,
    expiryDate,
  } = input;

  if (
    !name?.trim() ||
    !mobile?.trim() ||
    !planName?.trim() ||
    !planAmount ||
    planAmount <= 0
  ) {
    return {
      success: false,
      error: "Name, mobile, plan name, and a plan amount above 0 are required.",
    };
  }

  const expiry = expiryDate ? new Date(expiryDate) : null;

  const updates = {
    name: name.trim(),
    mobile: mobile.trim(),
    age: age ?? null,
    gender: gender || "male",
    email: email?.trim() || null,
    planName: planName.trim(),
    planAmount: Number(planAmount),
    paid: Number(paid ?? 0),
    pendingAmount: Number(pendingAmount ?? 0),
    ...(expiry ? { expiryDate: Timestamp.fromDate(expiry) } : {}),
  };

  try {
    await adminDb.collection("members").doc(memberId).update(updates);
    revalidateTag("members");
    revalidateTag("stats");

    return {
      success: true,
      expiryDate: expiry ? expiry.toISOString() : null,
    };
  } catch (error) {
    console.error("updateMemberAction failed:", error);
    return { success: false, error: "Could not update member. Try again." };
  }
}
