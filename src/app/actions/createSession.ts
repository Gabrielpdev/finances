"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";

export async function createSession(idToken: string) {
  const decoded = await auth.verifyIdToken(idToken);

  cookies().set(`${LOCAL_STORAGE_KEY}_session`, idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return decoded.uid;
}
