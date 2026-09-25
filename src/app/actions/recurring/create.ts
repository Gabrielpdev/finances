"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { IRecurringData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

export async function createRecurring(data: IRecurringData) {
  const authResult = await checkUserToken();
  if (!authResult.valid) throw new Error("Unauthorized");

  if (data.amount >= 0) {
    throw new Error("Recurring transactions must have a negative amount");
  }

  if (!Number.isInteger(data.day) || data.day < 1 || data.day > 31) {
    throw new Error("Recurring transaction day must be between 1 and 31");
  }

  await db.collection("recurringTransactions").doc(data.id).set(data);
  revalidateTag("recurring-list", "max");
}
