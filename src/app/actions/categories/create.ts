"use server";

import { db } from "@/lib/firebase-admin";

import { ICategory } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

export async function createCategories(data: ICategory) {
  try {
    await checkUserToken();

    await db.collection("categories").add(data);

    revalidateTag("categories-list");
  } catch (error) {
    console.error("Error creating categories:", error);
    throw error;
  }
}
