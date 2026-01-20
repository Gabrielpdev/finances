"use server";

import { db } from "@/lib/firebase-admin";

import { ICategory } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

interface UpdateCategoriesParams {
  id: string;
  data: ICategory;
}

export async function updateCategories({ id, data }: UpdateCategoriesParams) {
  try {
    await checkUserToken();

    await db
      .collection("categories")
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date(),
      });
  } catch (error) {
    console.error("Error creating categories:", error);
    throw error;
  }
}
