"use server";

import { db } from "@/lib/firebase-admin";

import { IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

export async function createData(data: IData) {
  try {
    await checkUserToken();

    await db.collection("transactions").doc(data.id).set(data, { merge: true });

    revalidateTag("data-list", "max");
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
}
