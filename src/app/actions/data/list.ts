"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/firebase-admin";

import { IData } from "@/types/data";
import { checkUserToken } from "../checkUserToken";

export const listDatas = unstable_cache(
  async () => {
    try {
      await checkUserToken();

      const snapshot = await db.collection("data").get();
      const dataList: IData[] = [];
      snapshot.forEach((doc) => {
        doc.data().data.forEach((item: IData) => {
          dataList.push(item);
        });
      });

      return dataList;
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
