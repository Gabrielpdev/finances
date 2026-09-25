"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { checkUserToken } from "../checkUserToken";
import {
  ICategory,
  IFormattedRecurringData,
  IRecurringData,
} from "@/types/data";
import { defaultCategory } from "@/helpers/getCategory";

export async function listRecurring(categories: ICategory[]) {
  const authResult = await checkUserToken();
  if (!authResult.valid) throw new Error("Unauthorized");
  const data = await getRecurring();

  return data.map(
    (item): IFormattedRecurringData => ({
      ...item,
      category:
        categories.find((category) => category.id === item.categoryId) ||
        defaultCategory,
    }),
  );
}

export const getRecurring = unstable_cache(
  async () => {
    const snapshot = await db.collection("recurringTransactions").get();
    const dataList: IRecurringData[] = [];

    snapshot.forEach((doc) => {
      dataList.push({ ...doc.data(), id: doc.id } as IRecurringData);
    });

    return JSON.parse(JSON.stringify(dataList)) as IRecurringData[];
  },
  ["recurring-list"],
  {
    revalidate: 60 * 60 * 24 * 30,
    tags: ["recurring-list"],
  },
);
