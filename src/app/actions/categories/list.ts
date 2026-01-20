"use server";
import { db } from "@/lib/firebase-admin";

import { ICategory } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { unstable_cache } from "next/cache";

export const listCategories = unstable_cache(
  async () => {
    try {
      await checkUserToken();

      const snapshot = await db.collection("categories").get();

      const dataList: ICategory[] = [];

      snapshot?.forEach((doc) => {
        const data = doc.data() as ICategory;

        dataList.push({ ...data, id: doc.id });
      });

      return dataList;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  ["categories-list"],
  {
    revalidate: 60 * 60 * 24 * 30, // 30 days
    tags: ["categories-list"],
  },
);
