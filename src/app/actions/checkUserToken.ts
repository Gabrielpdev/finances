"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { createSession } from "./createSession";

export const checkUserToken = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(`${LOCAL_STORAGE_KEY}_session`);

  const token = session?.value;

  if (!token) {
    return { valid: false, reason: "no-token" as const };
  }

  try {
    // 1️⃣ Verify token
    const decoded = await auth.verifySessionCookie(token, true);

    const allowedUsers = process.env.ALLOWED_USERS?.split(",");

    const userUid = decoded.uid;

    // 2️⃣ Block unauthorized user
    if (!allowedUsers?.includes(userUid)) {
      return { valid: false, reason: "forbidden" as const };
    }

    return { valid: true as const };
  } catch (error: any) {
    if (error?.code === "auth/id-token-expired") {
      console.warn("Token expired, attempting to refresh...");
      return refreshUserToken();
    }

    console.error("Error verifying token:", error);
    return { valid: false, reason: "invalid" as const };
  }
};

export const refreshUserToken = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(`${LOCAL_STORAGE_KEY}_session`);

  const token = session?.value;

  if (!token) {
    return { valid: false, reason: "no-token" as const };
  }

  try {
    await auth.verifySessionCookie(token, true);
    // await auth.verifyIdToken(token, true);
    // await auth.verifySessionCookie(token);

    return { valid: true as const };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { valid: false, reason: "refresh-failed" as const };
  }
};
