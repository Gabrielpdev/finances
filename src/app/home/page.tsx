"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { months } from "@/constants/months";
import { ICategory, IData, IShowedData } from "@/types/data";

import { Loading } from "@/components/loading";
import { formatToDate } from "@/utils/formatToDate";
import { CurrencyContext } from "@/providers/currency";
import { groupByMonths } from "@/helpers/groupByMonths";
import { DataTable } from "@/components/modules/dataTable";
import { HeaderTable } from "@/components/modules/headerTable";

import { getCategory } from "@/helpers/getCategory";

import MultiSelect from "@/components/elements/multiSelect";
import Select from "@/components/elements/select";
import { TransactionsContext } from "@/providers/transactions";

export default function Home() {
  const [showedData, setShowedData] = useState<IShowedData>({});

  const [loading, setLoading] = useState(true);

  const [typesOptions, setTypesOptions] = useState<string[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState("");

  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [selectedFilterDate, setSelectedFilterDate] = useState<string[]>([]);

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<
    string[]
  >([]);

  const [selectedItemToExclude, setSelectedItemToExclude] = useState<string[]>(
    [],
  );

  const { setValue } = useContext(CurrencyContext);
  const { transactions, categories } = useContext(TransactionsContext);

  const removeCreditDatas = useCallback(
    (data: IData[], savedCategories: ICategory[]) => {
      try {
        const dateSet = new Set<string>();
        const typeSet = new Set<string>();

        for (const obj of data) {
          const date = formatToDate(obj);
          const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;
          dateSet.add(monthKey);
          typeSet.add(obj.Tipo);
        }

        const sorted = [...data].sort((a, b) => {
          return formatToDate(b).getTime() - formatToDate(a).getTime();
        });

        setDateOptions(Array.from(dateSet));
        setTypesOptions(Array.from(typeSet));

        const grouped = groupByMonths(sorted, savedCategories);
        setShowedData(grouped);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [],
  );

  const readJsonFile = useCallback(async () => {
    setLoading(true);
    try {
      removeCreditDatas(transactions, categories);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [transactions, categories, removeCreditDatas]);

  useEffect(() => {
    readJsonFile();
  }, [readJsonFile]);

  const formatTotalValue = useCallback(() => {
    let inTotal = 0;
    let outTotal = 0;

    for (const item of transactions) {
      if (selectedFilterDate.length !== 0) {
        const date = formatToDate(item);
        const itemMonth = `${months[date.getMonth()]}-${date.getFullYear()}`;

        if (!selectedFilterDate.includes(itemMonth)) continue;
      }

      if (selectedFilterType !== "" && selectedFilterType !== item["Tipo"]) {
        continue;
      }

      const estabelecimento = item["Estabelecimento"];
      const category = getCategory(estabelecimento, categories);
      if (
        selectedFilterCategory.length !== 0 &&
        !selectedFilterCategory.includes(category.name)
      ) {
        continue;
      }

      if (selectedItemToExclude.includes(item.Identificador)) {
        continue;
      }

      const valorItem = Number(item["Valor"]);
      if (valorItem > 0) {
        inTotal += valorItem;
      } else {
        outTotal += valorItem;
      }
    }

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
  }, [
    transactions,
    categories,
    selectedFilterDate,
    selectedFilterType,
    selectedFilterCategory,
    selectedItemToExclude,
    setValue,
  ]);

  useEffect(() => {
    formatTotalValue();
  }, [formatTotalValue]);

  return (
    <div className="flex max-w-6xl w-full flex-col mt-24 m-auto">
      <div className="flex items-center gap-5 p-2 max-sm:flex-wrap">
        <div className="flex gap-1">
          <MultiSelect
            label="Data:"
            options={dateOptions.map((cat) => cat)}
            selected={selectedFilterDate}
            onSelect={(value) => setSelectedFilterDate(value)}
          />
        </div>

        <div className="flex gap-1">
          <Select
            title="Todos"
            label="Tipo:"
            options={typesOptions}
            selected={selectedFilterType}
            onSelect={(value) => setSelectedFilterType(value)}
          />
        </div>

        <div className="flex gap-1">
          <MultiSelect
            label="Categoria:"
            options={[...categories.map((cat) => cat.name), "Outros"]}
            selected={selectedFilterCategory}
            onSelect={(value) => setSelectedFilterCategory(value)}
          />
        </div>
      </div>

      <HeaderTable />

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        Object.entries(showedData)
          ?.filter(
            ([key]) =>
              selectedFilterDate.length === 0 ||
              selectedFilterDate.includes(key),
          )
          ?.map(([key, month]) => {
            return (
              <div key={key} className="gap-1 flex flex-col relative">
                <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
                  <h2 className="text-base text-center">{key}</h2>
                </div>

                {month
                  .filter(
                    (item) =>
                      selectedFilterType === "" ||
                      selectedFilterType === item.Tipo,
                  )
                  .filter((item) => {
                    return (
                      selectedFilterCategory.length === 0 ||
                      selectedFilterCategory.includes(item.Categoria.name)
                    );
                  })
                  .map((item) => {
                    return (
                      <DataTable
                        item={item}
                        selectedItemToExclude={selectedItemToExclude}
                        setSelectedItemToExclude={setSelectedItemToExclude}
                        key={item.Identificador}
                      />
                    );
                  })}
              </div>
            );
          })
      )}
    </div>
  );
}
