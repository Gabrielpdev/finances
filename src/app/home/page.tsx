"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { months } from "@/constants/months";
import { IData, IShowedData } from "@/types/data";

import { Loading } from "@/components/loading";
import { formatToDate } from "@/utils/formatToDate";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { CurrencyContext } from "@/providers/currency";
import { groupByMonths } from "@/helpers/groupByMonths";
import { DataTable } from "@/components/modules/dataTable";
import { HeaderTable } from "@/components/modules/headerTable";

import { listDatas } from "../actions/data/list";
import { listCategories } from "../actions/categories/list";
import { CategoriesContext } from "@/providers/categories";


export default function Home() {
  const [showedData, setShowedData] = useState<IShowedData>({});
  const [rawData, setRawData] = useState<IData[]>([]);

  const [loading, setLoading] = useState(true);

  const [typesOptions, setTypesOptions] = useState<string[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState("Todos");

  const [dateOptions, setDateOptions] = useState<any>([]);
  const [selectedFilterDate, setSelectedFilterDate] = useState("Todos");

  const [categoryOptions, setCategoriesOptions] = useState<any>([]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("Todos");

  const [selectedItemToExclude, setSelectedItemToExclude] = useState<string[]>(
    [],
  );

  const { setValue } = useContext(CurrencyContext);
  const { setCategories, categories } = useContext(CategoriesContext);

  const readJsonFile = async () => {
    setLoading(true);
    try {
      const savedData = await listDatas();
      const savedCategories = await listCategories();

      setCategories(savedCategories);
      setRawData(savedData);
      removeCreditDatas(savedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeCreditDatas = async (data: IData[]) => {
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

      const dateFilterList = Array.from(uniqueDateMap.values());
      setDateOptions(dateFilterList);

      const typeFilterList = Array.from(uniqueTypeMap.values());
      setTypesOptions(typeFilterList);

      const categoriesString = localStorage.getItem(
        `${LOCAL_STORAGE_KEY}_categories`,
      );
      const categories = categoriesString ? JSON.parse(categoriesString) : [];

      setCategoriesOptions(categories);

      const grouped = groupByMonths(data);

      setShowedData(grouped);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatTotalValue = useCallback(() => {
    let inTotal = 0;
    let outTotal = 0;

    for (const item of rawData) {
      if (selectedFilterDate !== "Todos") {
        const date = formatToDate(item);
        const itemMonth = `${months[date.getMonth()]}-${date.getFullYear()}`;
        if (selectedFilterDate !== itemMonth) continue;
      }

      if (
        selectedFilterType !== "Todos" &&
        selectedFilterType !== item["Tipo"]
      ) {
        continue;
      }

      if (
        selectedFilterCategory !== "Todos" &&
        selectedFilterCategory !== item["Categoria"].name
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
    selectedFilterDate,
    selectedFilterType,
    selectedFilterCategory,
    selectedItemToExclude,
    setValue,
  ]);

  useEffect(() => {
    readJsonFile();
  }, []);

  useEffect(() => {
    formatTotalValue();
  }, [formatTotalValue]);

  return (
    <div className="flex max-w-6xl w-full flex-col mt-24 m-auto">
      <div className="flex items-center gap-5 p-2 max-sm:flex-wrap">
        <div className="flex gap-1">
          <label htmlFor="data">Data:</label>
          <select
            className="text-black"
            id="data"
            onChange={(e) => setSelectedFilterDate(e.target.value)}
          >
            <option className="text-black">Todos</option>
            {dateOptions?.map((item: any) => (
              <option className="text-black" key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          <label htmlFor="tipo">Tipo:</label>
          <select
            className="text-black"
            id="tipo"
            onChange={(e) => setSelectedFilterType(e.target.value)}
          >
            <option className="text-black">Todos</option>
            {typesOptions?.map((item: any) => (
              <option className="text-black" key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          <label htmlFor="categoria">Categoria:</label>
          <select
            className="text-black"
            id="categoria"
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
          >
            <option className="text-black">Todos</option>
            <option className="text-black">Outros</option>
            {categoryOptions?.map((item: any) => (
              <option className="text-black" key={item.name}>
                {item.name}
              </option>
            ))}
          </select>
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
              key === selectedFilterDate || selectedFilterDate === "Todos",
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
                      selectedFilterType === "Todos" ||
                      selectedFilterType === item["Tipo"],
                  )
                  .filter(
                    (item) =>
                      selectedFilterCategory === "Todos" ||
                      selectedFilterCategory === item["Categoria"].name,
                  )
                  .map((item) => (
                    <DataTable
                      item={item}
                      selectedItemToExclude={selectedItemToExclude}
                      setSelectedItemToExclude={setSelectedItemToExclude}
                      key={item.Identificador}
                    />
                  ))}
              </div>
            );
          })
      )}
    </div>
  );
}
