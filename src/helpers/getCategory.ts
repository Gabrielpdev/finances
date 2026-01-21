"use client";

import { ICategory } from "@/types/data";

export const getCategory = (value: string, categories: ICategory[]) => {
  const fined = categories.find((category: ICategory) =>
    category.list.some((item) => value.includes(item)),
  );

  return fined
    ? {
        name: fined.name,
        icon: fined.icon,
      }
    : {
        name: "Outros",
        icon: "",
      };
};
