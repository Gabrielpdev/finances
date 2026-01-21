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

import { listDatas } from "../actions/data/list";
import { listCategories } from "../actions/categories/list";
import { CategoriesContext } from "@/providers/categories";
import { getCategory } from "@/helpers/getCategory";

import MultiSelect from "@/components/elements/multiSelect";
import Select from "@/components/elements/select";

export default function Home() {
  const [showedData, setShowedData] = useState<IShowedData>({});
  const [rawData, setRawData] = useState<IData[]>([]);

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
  const { setCategories, categories } = useContext(CategoriesContext);

  const removeCreditDatas = useCallback(
    async (data: IData[], savedCategories: ICategory[]) => {
      try {
        const uniqueDateMap = new Map();
        const uniqueTypeMap = new Map();

        data.forEach((obj) => {
          const date = formatToDate(obj);

          const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

          uniqueDateMap.set(monthKey, monthKey);
          uniqueTypeMap.set(obj.Tipo, obj.Tipo);
        });

        data.sort((a, b) => {
          const dateA = formatToDate(a);
          const dateB = formatToDate(b);

          return dateB.getTime() - dateA.getTime();
        });

        const dateFilterList = Array.from(uniqueDateMap.values()) as string[];
        setDateOptions(dateFilterList);

        const typeFilterList = Array.from(uniqueTypeMap.values());
        setTypesOptions(typeFilterList);

        const grouped = groupByMonths(data, savedCategories);

        setShowedData(grouped);
        setCategories(savedCategories);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [],
  );

  const readJsonFile = useCallback(async () => {
    setLoading(true);
    try {
      const savedData = await listDatas();
      const savedCategories = await listCategories();

      setRawData(savedData);
      removeCreditDatas(savedData, savedCategories);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [removeCreditDatas]);

  useEffect(() => {
    readJsonFile();
  }, [readJsonFile]);

  const formatTotalValue = useCallback(() => {
    let inTotal = 0;
    let outTotal = 0;

    for (const item of rawData) {
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
    rawData,
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
