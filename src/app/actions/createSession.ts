"use server";

import { cookies } from "next/headers";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { auth } from "@/lib/firebase-admin";

export async function createSession(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 5 * 1000,
  });

  cookieStore.set(`${LOCAL_STORAGE_KEY}_session`, sessionCookie);
}
