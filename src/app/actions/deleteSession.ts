"use server";

import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { cookies } from "next/headers";

export async function deleteSession() {
  cookies().delete(`${LOCAL_STORAGE_KEY}_session`);
}
