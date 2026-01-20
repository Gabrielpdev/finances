"use server";

import { db } from "@/lib/firebase-admin";

import { IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

export async function createData(data: IData[]) {
  try {
    await checkUserToken();

    await db.collection("data").add({
      data,
    });
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
}
