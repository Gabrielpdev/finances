"use client";
import { useState, createContext, useEffect, useCallback } from "react";

import {
  ITransactionsContext,
  IData,
  ICategory,
  IFormattedData,
} from "@/types/data";
import { listCategories } from "@/app/actions/categories/list";
import { listDatas } from "@/app/actions/data/list";
import { getCategory } from "@/helpers/getCategory";
import {
  endOfCurrentMonth,
  startOfCurrentMonth,
} from "@/constants/currentMonth";
import { DateRange } from "react-day-picker";

export const TransactionsContext = createContext({} as ITransactionsContext);

export default function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<IFormattedData[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: startOfCurrentMonth,
    to: endOfCurrentMonth,
  });

  const init = useCallback(async () => {
    console.log("Initializing TransactionsProvider...");

    let savedCategories = categories;
    let savedData: IData[] = [];

    if (categories.length <= 0) {
      savedCategories = await listCategories();

      console.log("Fetched categories:", savedCategories);
      setCategories(savedCategories);
    }

    if (transactions.length <= 0) {
      savedData = await listDatas(
        startOfCurrentMonth.getTime(),
        endOfCurrentMonth.getTime(),
      );
      console.log("Fetched transactions:", savedData);
    }

    putCategoriesOnTransactions(savedData, savedCategories);
  }, []);

  const putCategoriesOnTransactions = useCallback(
    async (
      savedData: IData[] | IFormattedData[],
      savedCategories: ICategory[],
    ) => {
      let transactionsWithCategories = returnTransactionWithCategories(
        savedData,
        savedCategories,
      );

      setTransactions(transactionsWithCategories);
    },
    [],
  );

  const returnTransactionWithCategories = useCallback(
    (savedData: IData[] | IFormattedData[], savedCategories: ICategory[]) => {
      let transactionsWithCategories: IFormattedData[] = [];

      for (const item of savedData) {
        const estabelecimento = item.description;

        const category = getCategory(estabelecimento, savedCategories);

        transactionsWithCategories.push({
          ...item,
          category: category,
        });
      }

      return transactionsWithCategories;
    },
    [],
  );

  const refreshTransactions = useCallback(
    async (startDate?: number, endDate?: number) => {
      const savedData = await listDatas(
        startDate || startOfCurrentMonth.getTime(),
        endDate || endOfCurrentMonth.getTime(),
      );
      putCategoriesOnTransactions(savedData, categories);
    },
    [categories, putCategoriesOnTransactions],
  );

  const refreshCategories = useCallback(async () => {
    const savedCategories = await listCategories();
    setCategories(savedCategories);
    putCategoriesOnTransactions(transactions, savedCategories);
  }, [transactions, putCategoriesOnTransactions]);

  function updateLocalTransactions() {
    putCategoriesOnTransactions(transactions, categories);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        filterDate,
        setFilterDate,
        transactions,
        setTransactions,
        categories,
        setCategories,
        refreshTransactions,
        refreshCategories,
        updateLocalTransactions,
        returnTransactionWithCategories,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
