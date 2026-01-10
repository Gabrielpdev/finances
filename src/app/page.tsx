"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { months } from "@/constants/months";
import { IData, IShowedData } from "@/types/data";

import { Loading } from "@/components/loading";
import { formatToDate } from "@/utils/formatToDate";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { CurrencyContext } from "@/providers/currency";
import { header } from "@/constants/tableHeader";
import { groupByMonths } from "@/helpers/groupByMonths";
import { TableValue } from "@/components/elements/tableValue";
import { PiXCircleLight } from "react-icons/pi";

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
    []
  );

  const { setValue } = useContext(CurrencyContext);

  const readJsonFile = async () => {
    setLoading(true);
    try {
      // const token = await user?.getIdToken();
      // if (!token) return;

      // const response = await fetch(`/api/list`, {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      //   credentials: "include",
      // });

      // const { data } = await response.json();

      // if (!data) return;
      const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      const data = dataString ? JSON.parse(dataString) : [];

      setRawData(data);
      removeCreditDatas(data);
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
        `${LOCAL_STORAGE_KEY}_categories`
      );
      const categories = categoriesString ? JSON.parse(categoriesString) : [];

      setCategoriesOptions(categories);

      const grouped = groupByMonths(data);

      setShowedData(grouped);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSelectItemToExclude = (itemId: string) => {
    const updatedExcludedItems = [...selectedItemToExclude];

    if (updatedExcludedItems.includes(itemId)) {
      const index = updatedExcludedItems.indexOf(itemId);
      updatedExcludedItems.splice(index, 1);
    } else {
      updatedExcludedItems.push(itemId);
    }

    setSelectedItemToExclude(updatedExcludedItems);
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
  ]);

  useEffect(() => {
    readJsonFile();
  }, []);

  useEffect(() => {
    formatTotalValue();
  }, [formatTotalValue]);

  return (
    <div className="flex max-w-6xl w-full flex-col  mt-24 m-auto">
      <div className="flex items-center gap-5 p-2 max-md:order-1">
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

      <div className="sticky top-0 left-0 right-0 border max-sm:hidden py-3  bg-neutral-200">
        <div
          className={`grid grid-cols-[repeat(40,_minmax(0,_1fr))] text-center max-sm:grid-cols-6 max-sm:text-xs`}
        >
          {header.map((item) => (
            <span
              key={item}
              className={`flex ${
                item === "Estabelecimento"
                  ? "col-[span_21]"
                  : "col-[span_6] justify-center"
              } items-center border-r-2 max-sm:border text-zinc-400`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        Object.entries(showedData)
          ?.filter(
            ([key]) =>
              key === selectedFilterDate || selectedFilterDate === "Todos"
          )
          ?.map(([key, month]) => {
            return (
              <div key={key} className="gap-1 flex flex-col">
                <div className="flex items-center justify-center text-zinc-400 py-4">
                  <h2 className="text-base text-center">{key}</h2>
                </div>

                {month
                  .filter(
                    (item) =>
                      selectedFilterType === "Todos" ||
                      selectedFilterType === item["Tipo"]
                  )
                  .filter(
                    (item) =>
                      selectedFilterCategory === "Todos" ||
                      selectedFilterCategory === item["Categoria"].name
                  )
                  .map((item) => (
                    <div
                      key={item.Identificador}
                      className={`grid grid-cols-[repeat(40,_minmax(0,_1fr))] text-center bg-white p-5 pr-1 rounded-md ${
                        selectedItemToExclude.includes(item.Identificador)
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      {header.map((headerItem) => (
                        <div
                          key={headerItem}
                          className={`flex items-center justify-between flex-col ${
                            headerItem === "Estabelecimento"
                              ? "col-[span_21]"
                              : "col-[span_6]"
                          }`}
                        >
                          <TableValue
                            item={item}
                            type={headerItem as keyof IData}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          onSelectItemToExclude(item.Identificador)
                        }
                        className={`flex items-center justify-center flex-col col-span-1`}
                      >
                        <PiXCircleLight />
                      </button>
                    </div>
                  ))}
              </div>
            );
          })
      )}
    </div>
  );
}
