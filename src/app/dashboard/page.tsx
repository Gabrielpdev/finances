/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { groupCategories } from "@/helpers/getValuesOnCategories";
import SimpleBarChart, { IBarChartData } from "@/components/elements/bar-chart";
import SimpleHorizontalBarChart from "@/components/elements/horizontal-chart";
import { TransactionsContext } from "@/providers/transactions";
import { groupByMonths } from "@/helpers/groupByMonths";
import { HeaderTable } from "@/components/modules/headerTable";
import { IShowedData } from "@/types/data";
import { DataTable } from "@/components/modules/dataTable";
import { MouseHandlerDataParam } from "recharts";
import { DatePickerWithRange } from "@/components/elements/calendar";
import { PiMagnifyingGlass } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { groupTypes } from "@/helpers/getValuesOnTypes";
import { Loading } from "@/components/loading";

export default function Home() {
  const [chartCategoriesData, setChartCategoriesData] = useState<
    IBarChartData[]
  >([]);
  const [chartTypeData, setChartTypeData] = useState<IBarChartData[]>([]);

  const [showedData, setShowedData] = useState<IShowedData>({});

  const {
    transactions,
    filterDate,
    refreshTransactions,
    getFutureTransactions,
    futureTransactions,
    loading,
  } = useContext(TransactionsContext);

  const removeCreditDatas = useCallback(() => {
    setChartCategoriesData(groupCategories(transactions));
    setChartTypeData(groupTypes(transactions));
  }, [transactions]);

  useEffect(() => {
    removeCreditDatas();
    getFutureTransactions();
  }, [removeCreditDatas]);

  const futureExpensesTotal = useMemo(
    () =>
      futureTransactions
        ?.filter((item) => item.amount < 0)
        .reduce((total, item) => total + item.amount, 0),
    [futureTransactions],
  );

  const onSelectCategory = useCallback(
    (category: MouseHandlerDataParam) => {
      const filteredData = transactions.filter(
        (item) => item.category.name === category.activeLabel,
      );

      setShowedData(groupByMonths(filteredData));
    },
    [transactions],
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

  if (loading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-8 container m-auto max-sm:p-2">
      <h2 className="text-4xl font-semibold tracking-tight text-foreground">
        Visão Geral
      </h2>

      <div className="flex items-end gap-4 w-full mt-5 m-auto max-sm:flex-col">
        <DatePickerWithRange />

        <Button
          className="flex items-center justify-center max-sm:w-full"
          onClick={searchWithFilters}
        >
          Buscar
          <PiMagnifyingGlass />
        </Button>
      </div>

      <h4 className="text-2xl font-semibold">
        Gastos futuros:
        <span className="text-lg font-semibold text-muted-foreground">
          {` `}
          {futureExpensesTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </h4>
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-border/70 bg-card p-3 shadow-sm">
        {!!futureTransactions.length ? (
          futureTransactions.map((item) => (
            <DataTable item={item} key={item.id} />
          ))
        ) : (
          <div className="flex items-center justify-center p-6 gap-4 w-full max-sm:flex-wrap max-sm:p-1">
            Nenhuma transação futura encontrada.
          </div>
        )}
      </div>

      <h4 className="text-2xl font-semibold">Gastos no mês</h4>
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-border/70 bg-card p-3 shadow-sm">
        <div className="flex items-center justify-center p-6 gap-4 w-full max-sm:flex-wrap max-sm:p-1">
          <SimpleBarChart
            data={chartCategoriesData}
            onSelectBar={onSelectCategory}
          />
          <div className="flex flex-col gap-4 w-full max-sm:flex-wrap">
            <SimpleHorizontalBarChart data={chartCategoriesData} />
            <SimpleHorizontalBarChart data={chartTypeData} />
          </div>
        </div>

        {Object.entries(showedData)?.[0]?.[0] && (
          <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
            <h2 className="text-base text-center">
              {Object.entries(showedData)?.[0]?.[0]}
            </h2>
          </div>
        )}
        {!!Object.keys(showedData).length && <HeaderTable />}
        {Object.entries(showedData)?.map(([key, month], index) => {
          return (
            <div key={key} className="gap-1 flex flex-col w-full relative">
              {index !== 0 && (
                <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
                  <h2 className="text-base text-center">{key}</h2>
                </div>
              )}

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
