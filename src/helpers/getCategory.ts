"use client";

import { ICategory } from "@/types/data";

export const defaultCategory: ICategory = {
  name: "Outros",
  icon: "",
  id: "others",
  list: [],
  color: "#0088FE",
  goal: 0,
};

export const getCategory = (value: string, categories: ICategory[]) => {
  const found = categories.find((category: ICategory) =>
    category.list.some((item) => {
      return value.toLocaleLowerCase().includes(item.toLocaleLowerCase());
    }),
  );

  return found ? found : defaultCategory;
};
