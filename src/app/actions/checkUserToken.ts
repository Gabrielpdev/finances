"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";

export const checkUserToken = async () => {
  const session = cookies().get(`${LOCAL_STORAGE_KEY}_session`);

  const token = session?.value;

  if (!token) {
    return { valid: false, reason: "no-token" as const };
  }
  try {
    // 1️⃣ Verify token
    const decoded = await auth.verifyIdToken(token);

    const allowedUsers = process.env.ALLOWED_USERS?.split(",");

    const userUid = decoded.uid;

    // 2️⃣ Block unauthorized user
    if (!allowedUsers?.includes(userUid)) {
      return { valid: false, reason: "forbidden" as const };
    }

    return { valid: true as const };
  } catch (error: any) {
    if (error?.code === "auth/id-token-expired") {
      return { valid: false, reason: "expired" as const };
    }

    return { valid: false, reason: "invalid" as const };
  }
};
