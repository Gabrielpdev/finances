"use client";

import { ICategory } from "@/types/data";

export const getCategory = (value: string, categories: ICategory[]) => {
  const found = categories.find((category: ICategory) =>
    category.list.some((item) => value.includes(item)),
  );

  return found
    ? {
        name: found.name,
        icon: found.icon,
      }
    : {
        name: "Outros",
        icon: "",
      };
};
