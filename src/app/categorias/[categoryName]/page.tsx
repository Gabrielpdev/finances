/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useContext, useCallback, useMemo } from "react";

import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";
import { ICategory } from "@/types/data";

import { TransactionsContext } from "@/providers/transactions";
import CategoryForm from "./_components/Form";
import CategoryList from "./_components/List";

export default function CategoryName() {
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const { setCategories, categories, updateLocalData } =
    useContext(TransactionsContext);

  const selectedCategory = useMemo(() => {
    const filtered = categories.find(
      (category) => category.name.toLocaleLowerCase() === params.categoryName,
    );

    return filtered;
  }, [params.categoryName, categories]);

  const updateCategoryDataLocally = useCallback(
    (newCategoryData: ICategory) => {
      const newCategories = categories.map((category) => {
        if (category.id === newCategoryData.id) {
          return newCategoryData;
        }

        return category;
      });

      setCategories(newCategories);
      updateLocalData({
        savedCategories: newCategories,
      });
    },
    [categories],
  );

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 gap-4 w-full mt-4 max-sm:grid-cols-1 max-sm:px-3`}
        >
          <div className={`flex flex-col w-full gap-3`}>
            <CategoryForm
              selectedCategory={selectedCategory}
              setLoading={setLoading}
              updateCategoryDataLocally={updateCategoryDataLocally}
            />
          </div>

          <div className={`flex flex-col w-full`}>
            <CategoryList
              selectedCategory={selectedCategory}
              updateCategoryDataLocally={updateCategoryDataLocally}
              setLoading={setLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
