"use server";

import { cookies } from "next/headers";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";

export async function createSession(idToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(`${LOCAL_STORAGE_KEY}_session`, idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}
