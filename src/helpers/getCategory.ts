"use client";
import { useContext } from "react";

import { ICategory } from "@/types/data";
import { CategoriesContext } from "@/providers/categories";

export const useGetCategory = (value: string) => {
  const { categories } = useContext(CategoriesContext);

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
