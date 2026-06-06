"use server";

import { db } from "@/lib/firebase-admin";

import { IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

interface UpdateTransactionParams {
  data: IData;
}

export async function updateTransaction({ data }: UpdateTransactionParams) {
  try {
    await checkUserToken();

    await db
      .collection("transactions")
      .doc(data.id)
      .update({
        ...data,
        updatedAt: new Date(),
      });

    revalidateTag("data-list", "max");
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}
