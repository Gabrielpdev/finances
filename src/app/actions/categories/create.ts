"use server";

import { db } from "@/lib/firebase-admin";

import { ICategory } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

export async function createCategories(data: ICategory) {
  try {
    await checkUserToken();

    await db.collection("categories").add(data);
  } catch (error) {
    console.error("Error creating categories:", error);
    throw error;
  }
}
