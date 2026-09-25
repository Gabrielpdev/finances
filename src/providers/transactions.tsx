"use client";
import { useState, createContext, useEffect, useRef } from "react";

import {
  ITransactionsContext,
  IData,
  ICategory,
  IFormattedData,
  IFormattedRecurringData,
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
import { listRecurring } from "@/app/actions/recurring/list";

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
  const [recurringTransactions, setRecurringTransactions] = useState<
    IFormattedRecurringData[]
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
    setRecurringTransactions(
      recurringTransactions.map((item) => ({
        ...item,
        category:
          savedCategories.find((category) => category.id === item.categoryId) ||
          item.category,
      })),
    );
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
    const now = new Date();
    const nextMonth = new Date();

    nextMonth.setDate(1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const endOfNextMonth = new Date(nextMonth);
    endOfNextMonth.setMonth(endOfNextMonth.getMonth() + 1);
    endOfNextMonth.setDate(0);
    endOfNextMonth.setHours(23, 59, 59, 999);

    const savedData = await listDatas({
      categories,
      start: now.getTime(),
      end: endOfNextMonth.getTime(),
    });

    const savedRecurring = await listRecurring(categories);
    const lastDayOfNextMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0,
    ).getDate();
    const projectedRecurring = savedRecurring.map((item) => {
      const day = Math.min(item.day, lastDayOfNextMonth);
      const month = now.getDate() > day ? nextMonth.getMonth() : now.getMonth();

      const projectedDate = new Date(nextMonth.getFullYear(), month, day);
      const date = projectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return {
        ...item,
        id: `recurring-${item.id}-${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}`,
        date,
        timestamp: projectedDate.getTime(),
      };
    });

    setRecurringTransactions(savedRecurring);
    setFutureTransactions([...savedData, ...projectedRecurring]);
    setLoading(false);
  };

  // Initialize on mount
  const init = async () => {
    setLoading(true);
    const result = await checkUserToken();

    if (!result.valid) {
      setLoading(false);
      return;
    }

    const savedCategories = await listCategories();

    const savedData = await listDatas({
      categories: savedCategories,
      start: startOfCurrentMonth.getTime(),
      end: endOfCurrentMonth.getTime(),
    });
    const savedRecurring = await listRecurring(savedCategories);

    setCategories(savedCategories);
    setTransactions(savedData);
    setRecurringTransactions(savedRecurring);
    setLoading(false);
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

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
        recurringTransactions,
        updateOneTransaction,
        loading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
