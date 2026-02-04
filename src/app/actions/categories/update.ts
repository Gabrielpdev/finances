"use server";

import { db } from "@/lib/firebase-admin";

import { ICategory } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { revalidateTag } from "next/cache";

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

    revalidateTag("categories-list");
  } catch (error) {
    console.error("Error creating categories:", error);
    throw error;
  }
}
