"use client";
import { useState, createContext, useEffect, useRef } from "react";

import {
  ITransactionsContext,
  IData,
  ICategory,
  IFormattedData,
} from "@/types/data";
import { listCategories } from "@/app/actions/categories/list";
import { listDatas } from "@/app/actions/data/list";
import {
  endOfCurrentMonth,
  startOfCurrentMonth,
} from "@/constants/currentMonth";
import { DateRange } from "react-day-picker";
import { transactionsWithCategories } from "@/helpers/transactionsWithCategories";
import { checkUserToken } from "@/app/actions/checkUserToken";

export const TransactionsContext = createContext({} as ITransactionsContext);

export default function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isInitializedRef = useRef(false);
  const [transactions, setTransactions] = useState<IFormattedData[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [futureTransactions, setFutureTransactions] = useState<
    IFormattedData[]
  >([]);
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: startOfCurrentMonth,
    to: endOfCurrentMonth,
  });

  const [loading, setLoading] = useState(true);

  const putCategoriesOnTransactions = (
    savedData: IData[] | IFormattedData[],
    savedCategories: ICategory[],
  ) => {
    const newTransactions = transactionsWithCategories(
      savedData,
      savedCategories,
    );
    setTransactions(newTransactions);
  };

  const refreshTransactions = async (startDate?: number, endDate?: number) => {
    setLoading(true);
    const savedData = await listDatas({
      categories,
      start:
        startDate ||
        filterDate?.from?.getTime() ||
        startOfCurrentMonth.getTime(),
      end: endDate || filterDate?.to?.getTime() || endOfCurrentMonth.getTime(),
    });
    setTransactions(savedData);
    setLoading(false);
  };

  const refreshCategories = async () => {
    setLoading(true);

    const savedCategories = await listCategories();

    setCategories(savedCategories);
    putCategoriesOnTransactions(transactions, savedCategories);
    setLoading(false);
  };

  const updateLocalData = ({
    savedData,
    savedCategories,
  }: {
    savedData?: IData[] | IFormattedData[];
    savedCategories?: ICategory[];
  }) => {
    const transactionToUpdate = savedData || transactions;
    const categoriesToUpdate = savedCategories || categories;

    putCategoriesOnTransactions(transactionToUpdate, categoriesToUpdate);
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

  const getFutureTransactions = async () => {
    setLoading(true);

    const now = new Date().getTime();

    const savedData = await listDatas({
      categories,
      start: now,
    });

    setFutureTransactions(savedData);
    setLoading(false);
  };

  // Initialize on mount
  const init = async () => {
    const result = await checkUserToken();

    if (!result.valid) {
      setLoading(false);
      return;
    }

    const savedCategories = await listCategories();

    setCategories(savedCategories);

    const savedData = await listDatas({
      categories: savedCategories,
      start: startOfCurrentMonth.getTime(),
      end: endOfCurrentMonth.getTime(),
    });

    setTransactions(savedData);
    setLoading(false);
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    setLoading(true);

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
        updateLocalData,
        getFutureTransactions,
        futureTransactions,
        updateOneTransaction,
        loading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
