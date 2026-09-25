"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { checkUserToken } from "../checkUserToken";

export async function deleteRecurring({ id }: { id: string }) {
  const authResult = await checkUserToken();
  if (!authResult.valid) throw new Error("Unauthorized");
  await db.collection("recurringTransactions").doc(id).delete();
  revalidateTag("recurring-list", "max");
}
