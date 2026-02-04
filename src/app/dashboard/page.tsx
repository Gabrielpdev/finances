"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { IData } from "@/types/data";

import { CurrencyContext } from "@/providers/currency";

import { groupCategories } from "@/helpers/getValuesOnCategories";
import SimpleBarChart, { IBarChartData } from "@/components/elements/bar-chart";
import SimpleHorizontalBarChart from "@/components/elements/horizontal-chart";
import MultiSelect from "@/components/elements/multiSelect";
import { formatToDate } from "@/utils/formatToDate";
import { months } from "@/constants/months";
import { TransactionsContext } from "@/providers/transactions";

export default function Home() {
  const [chartData, setChartData] = useState<IBarChartData[]>([]);

  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [selectedFilterDate, setSelectedFilterDate] = useState<string[]>([]);

  const { setValue } = useContext(CurrencyContext);
  const { transactions, categories } = useContext(TransactionsContext);

  const removeCreditDatas = useCallback(async () => {
    try {
      let inTotal = 0;
      let outTotal = 0;
      const uniqueDateMap = new Map();
      const uniqueTypeMap = new Map();

      transactions.forEach((obj) => {
        const date = formatToDate(obj);

        const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

        uniqueDateMap.set(monthKey, monthKey);
        uniqueTypeMap.set(obj.Tipo, obj.Tipo);
      });

      const dateFilterList = Array.from(uniqueDateMap.values()) as string[];
      setDateOptions(dateFilterList);

      setValue({
        in: inTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        out: outTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      });

      setChartData(groupCategories(transactions, categories));
    } catch (error) {
      console.error("Error:", error);
    }
  }, [categories, transactions]);

  useEffect(() => {
    removeCreditDatas();
  }, [removeCreditDatas]);

  const onFilterDate = useCallback(
    (value: string[]) => {
      setSelectedFilterDate(value);

      const filteredData = transactions.filter((item) => {
        const itemDate = formatToDate(item);
        const itemMonthYear = `${months[itemDate.getMonth()]}-${itemDate.getFullYear()}`;
        return value.length > 0 ? value.includes(itemMonthYear) : true;
      });

      setChartData(groupCategories(filteredData, categories));
    },
    [transactions, categories],
  );

  return (
    <div className="flex items-center flex-col p-8 gap-4 w-full mt-5">
      <h2 className="text-5xl font-semibold">Visão Geral</h2>

      <div className="flex items-center justify-between gap-4 w-full mt-5 m-auto">
        <MultiSelect
          label="Data:"
          options={dateOptions.map((cat) => cat)}
          selected={selectedFilterDate}
          onSelect={(value) => onFilterDate(value)}
        />
      </div>

      <div className="flex  items-center justify-center gap-4 w-full mt-5 bg-white p-6 rounded-lg shadow-md">
        <SimpleBarChart data={chartData} />
        <SimpleHorizontalBarChart data={chartData} />
      </div>
    </div>
  );
}
