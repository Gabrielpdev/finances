"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";

export const checkUserToken = async () => {
  const session = cookies().get(`${LOCAL_STORAGE_KEY}_session`);

  const token = session?.value;

  if (!token) {
    return false;
  }

  // 1️⃣ Verify token
  const decoded = await auth.verifyIdToken(token);

  const allowedUsers = process.env.ALLOWED_USERS?.split(",");

  const userUid = decoded.uid;

  // 2️⃣ Block unauthorized user
  if (!allowedUsers?.includes(userUid)) {
    throw new Error("Forbidden");
  }

  return true;
};
