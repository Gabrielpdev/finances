"use server";

import { db } from "@/lib/firebase-admin";

import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

interface DeleteCategoriesParams {
  id: string;
}

export async function deleteCategories({ id }: DeleteCategoriesParams) {
  try {
    await checkUserToken();

    await db.collection("categories").doc(id).delete();

    revalidateTag("categories-list");
  } catch (error) {
    console.error("Error deleting categories:", error);
    throw error;
  }
}
