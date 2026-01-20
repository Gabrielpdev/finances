"use client";
import { useState, createContext } from "react";

import { ICategoriesContext, ICategory } from "@/types/data";

export const CategoriesContext = createContext({} as ICategoriesContext);

export default function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<ICategory[]>([]);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}
