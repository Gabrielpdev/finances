"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/firebase-admin";

import { ICategory, IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";
import { transactionsWithCategories } from "@/helpers/transactionsWithCategories";

export interface IListDatasParams {
  start?: number;
  end?: number;
  categories: ICategory[];
}
export interface IGetDatasParams {
  start?: number;
  end?: number;
}

export const listDatas = async ({
  start,
  end,
  categories,
}: IListDatasParams) => {
  await checkUserToken();
  const data = await getDatas({ start, end });

  return transactionsWithCategories(data, categories);
};

export const getDatas = unstable_cache(
  async ({ start, end }: IGetDatasParams) => {
    try {
      // make the where only if the param exists, otherwise return all the data
      let query: FirebaseFirestore.Query = db.collection("transactions");

      if (start !== undefined) {
        query = query.where("timestamp", ">=", start);
      }
      if (end !== undefined) {
        query = query.where("timestamp", "<=", end);
      }

      const snapshot = await query.get();

      const dataList: IData[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as IData;
        dataList.push(data);
      });

      const result = JSON.parse(JSON.stringify(dataList)) as IData[];
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  ["data-list"],
  {
    revalidate: 60 * 60 * 24 * 30, // 30 days
    tags: ["data-list"],
  },
);
