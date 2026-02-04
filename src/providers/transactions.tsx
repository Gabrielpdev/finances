"use client";
import { useState, createContext, useEffect, useCallback, use } from "react";

import {
  ITransactionsContext,
  IData,
  ICategory,
  IFormattedData,
} from "@/types/data";
import { listCategories } from "@/app/actions/categories/list";
import { listDatas } from "@/app/actions/data/list";
import { getCategory } from "@/helpers/getCategory";

export const TransactionsContext = createContext({} as ITransactionsContext);

export default function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<IFormattedData[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const readJsonFile = useCallback(async () => {
    let savedCategories = categories;
    let savedData: IData[] = [];

    if (categories.length <= 0) {
      savedCategories = await listCategories();
      setCategories(savedCategories);
    }

    if (transactions.length <= 0) {
      savedData = await listDatas();
    }

    putCategoriesOnTransactions(savedData, savedCategories);
  }, []);

  const putCategoriesOnTransactions = useCallback(
    async (savedData: IData[], savedCategories: ICategory[]) => {
      let transactionsWithCategories: IFormattedData[] = [];

      for (const item of savedData) {
        const estabelecimento = item.Estabelecimento;

        const category = getCategory(estabelecimento, savedCategories);

        transactionsWithCategories.push({
          ...item,
          Categoria: category,
        });
      }

      setTransactions(transactionsWithCategories);
    },
    [],
  );

  const refreshTransactions = useCallback(async () => {
    const savedData = await listDatas();
    putCategoriesOnTransactions(savedData, categories);
  }, [categories, putCategoriesOnTransactions]);

  const refreshCategories = useCallback(async () => {
    const savedCategories = await listCategories();
    setCategories(savedCategories);
    putCategoriesOnTransactions(transactions, savedCategories);
  }, [transactions, putCategoriesOnTransactions]);

  function updateLocalTransactions() {
    putCategoriesOnTransactions(transactions, categories);
  }

  useEffect(() => {
    readJsonFile();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        setTransactions,
        categories,
        setCategories,
        refreshTransactions,
        refreshCategories,
        updateLocalTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
