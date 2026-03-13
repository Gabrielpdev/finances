"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { CurrencyContext } from "@/providers/currency";

import { groupCategories } from "@/helpers/getValuesOnCategories";
import SimpleBarChart, { IBarChartData } from "@/components/elements/bar-chart";
import SimpleHorizontalBarChart from "@/components/elements/horizontal-chart";
import { formatToDate } from "@/utils/formatToDate";
import { months } from "@/constants/months";
import { TransactionsContext } from "@/providers/transactions";
import { groupByMonths } from "@/helpers/groupByMonths";
import { HeaderTable } from "@/components/modules/headerTable";
import { IShowedData } from "@/types/data";
import { DataTable } from "@/components/modules/dataTable";
import { MouseHandlerDataParam } from "recharts";
import { DatePickerWithRange } from "@/components/elements/calendar";
import { PiMagnifyingGlass } from "react-icons/pi";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [chartData, setChartData] = useState<IBarChartData[]>([]);

  const [showedData, setShowedData] = useState<IShowedData>({});

  const { setValue } = useContext(CurrencyContext);
  const { transactions, categories, filterDate, refreshTransactions } =
    useContext(TransactionsContext);

  const removeCreditDatas = useCallback(async () => {
    try {
      let inTotal = 0;
      let outTotal = 0;
      const uniqueDateMap = new Map();

      transactions.forEach((obj) => {
        const date = formatToDate(obj);

        const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

        uniqueDateMap.set(monthKey, monthKey);
      });

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

      setChartData(groupCategories(transactions));
    } catch (error) {
      console.error("Error:", error);
    }
  }, [transactions]);

  useEffect(() => {
    removeCreditDatas();
  }, [removeCreditDatas]);

  const onSelectCategory = useCallback(
    (category: MouseHandlerDataParam) => {
      const filteredData = transactions.filter(
        (item) => item.category.name === category.activeLabel,
      );

      setShowedData(groupByMonths(filteredData, categories));
    },
    [transactions, categories],
  );

  const searchWithFilters = () => {
    const from = filterDate?.from
      ? new Date(filterDate.from).getTime()
      : undefined;
    const to = filterDate?.to ? new Date(filterDate.to).getTime() : undefined;

    if (from && to) {
      refreshTransactions(from, to);
    }
  };

  return (
    <div className="flex items-center flex-col p-8 gap-4 w-full mt-5 max-sm:p-2">
      <h2 className="text-5xl font-semibold">Visão Geral</h2>

      <div className="flex items-end gap-4 w-full mt-5 m-auto">
        <DatePickerWithRange />

        <Button
          className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white max-sm:w-full"
          onClick={searchWithFilters}
        >
          Buscar
          <PiMagnifyingGlass />
        </Button>
      </div>

      <div className="flex items-center flex-col justify-center gap-4 w-full mt-5 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center p-6 gap-4 w-full max-sm:flex-wrap max-sm:p-1">
          <SimpleBarChart data={chartData} onSelectBar={onSelectCategory} />
          <SimpleHorizontalBarChart data={chartData} />
        </div>

        {!!Object.keys(showedData).length && <HeaderTable />}

        {Object.entries(showedData)?.map(([key, month]) => {
          return (
            <div key={key} className="gap-1 flex flex-col w-full relative">
              <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
                <h2 className="text-base text-center">{key}</h2>
              </div>

              {month.map((item) => {
                return <DataTable item={item} key={item.id} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
