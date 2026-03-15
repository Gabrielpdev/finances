"use client";

import { ICategory } from "@/types/data";

export const defaultCategory = {
  name: "Outros",
  icon: "",
  id: "others",
  list: [],
  color: "#0088FE",
};

export const getCategory = (value: string, categories: ICategory[]) => {
  const found = categories.find((category: ICategory) =>
    category.list.some((item) => {
      return value.toLocaleLowerCase().includes(item.toLocaleLowerCase());
    }),
  );

  return found ? found : defaultCategory;
};
