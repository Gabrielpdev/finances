"use server";

import { db } from "@/lib/firebase-admin";

import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

interface DeleteTransactionParams {
  id: string;
}

export async function deleteTransaction({ id }: DeleteTransactionParams) {
  try {
    await checkUserToken();

    await db.collection("transactions").doc(id).delete();

    revalidateTag("data-list");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}
