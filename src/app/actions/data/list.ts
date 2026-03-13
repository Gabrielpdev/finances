"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/firebase-admin";

import { IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

export const listDatas = unstable_cache(
  async (start: number, end: number) => {
    try {
      await checkUserToken();

      const snapshot = await db
        .collection("transactions")
        .where("timestamp", ">=", start)
        .where("timestamp", "<=", end)
        .get();

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
