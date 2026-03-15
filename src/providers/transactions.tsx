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
import { defaultCategory, getCategory } from "@/helpers/getCategory";
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
  const [futureTransactions, setFutureTransactions] = useState<
    IFormattedData[]
  >([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: startOfCurrentMonth,
    to: endOfCurrentMonth,
  });

  const init = async () => {
    console.log("Initializing TransactionsProvider...");

    let savedCategories = categories;
    let savedData: IData[] = [];

    if (categories.length <= 0) {
      savedCategories = await listCategories();

      console.log("Fetched categories:", savedCategories);
      setCategories(savedCategories);
    }

    if (transactions.length <= 0) {
      savedData = await listDatas({
        start: filterDate?.from?.getTime() || startOfCurrentMonth.getTime(),
        end: filterDate?.to?.getTime() || endOfCurrentMonth.getTime(),
      });
      console.log("Fetched transactions:", savedData);
    }

    putCategoriesOnTransactions(savedData, savedCategories);
  };

  const putCategoriesOnTransactions = async (
    savedData: IData[] | IFormattedData[],
    savedCategories: ICategory[],
  ) => {
    let transactionsWithCategories = returnTransactionWithCategories(
      savedData,
      savedCategories,
    );

    setTransactions(transactionsWithCategories);
  };

  const returnTransactionWithCategories = (
    savedData: IData[] | IFormattedData[],
    savedCategories: ICategory[],
  ) => {
    let transactionsWithCategories: IFormattedData[] = [];

    for (const item of savedData) {
      if (item.categoryId !== "others") {
        const found = savedCategories.find(
          (category: ICategory) => category.id === item.categoryId,
        );

        transactionsWithCategories.push({
          ...item,
          category: found || defaultCategory,
        });
      } else {
        const estabelecimento = item.description;

        const category = getCategory(estabelecimento, savedCategories);

        transactionsWithCategories.push({
          ...item,
          category: category,
          categoryId: category.id,
        });
      }
    }

    return transactionsWithCategories;
  };

  const refreshTransactions = async (startDate?: number, endDate?: number) => {
    const savedData = await listDatas({
      start:
        startDate ||
        filterDate?.from?.getTime() ||
        startOfCurrentMonth.getTime(),
      end: endDate || filterDate?.to?.getTime() || endOfCurrentMonth.getTime(),
    });
    putCategoriesOnTransactions(savedData, categories);
  };

  const refreshCategories = async () => {
    const savedCategories = await listCategories();
    setCategories(savedCategories);
    putCategoriesOnTransactions(transactions, savedCategories);
  };

  const updateLocalTransactions = () => {
    putCategoriesOnTransactions(transactions, categories);
  };

  const getFutureTransactions = async () => {
    const now = new Date().getTime();

    const savedData = await listDatas({
      start: now,
    });

    const transactionsWithCategories = returnTransactionWithCategories(
      savedData,
      categories,
    );

    setFutureTransactions(transactionsWithCategories);
  };

  const updateOneTransaction = (data: IData) => {
    const newTransactions = transactions.map((transaction) => {
      if (transaction.id === data.id) {
        return {
          ...transaction,
          ...data,
          category: categories.find(
            (category) => category.id === data.categoryId,
          )!,
        };
      }
      return transaction;
    });

    setTransactions(newTransactions);
  };

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
        getFutureTransactions,
        futureTransactions,
        updateOneTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
