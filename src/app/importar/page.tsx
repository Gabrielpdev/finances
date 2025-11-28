"use client";
import { useState, useRef, useContext, useEffect } from "react";

import { ICategory, IData, IShowedData } from "@/types/data";

import { UserContext } from "@/providers/firebase";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { useRouter } from "next/navigation";
import { checkBankType } from "@/utils/checkBankType";
import { formatXpCSV } from "@/helpers/formatBanksCSV/xpCSV";
import { formatNubankCSV } from "@/helpers/formatBanksCSV/nubankCSV";
import { formatMercadoPagoCSV } from "@/helpers/formatBanksCSV/mercadoPagoCSV";
import { getColor } from "@/utils/getColor";
import { formatTableValue } from "@/utils/formatTableValue";
import { v4 } from "uuid";
import { header } from "@/constants/tableHeader";

export default function Import() {
  const { push } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // const { user } = useContext(UserContext);

  const [json, setJson] = useState<IData[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<IData[]>([]);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: any) => {
    e.preventDefault();

    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e?.target?.result as string;
          const json = csvJSON(content) as IData[];
          const filtered = filteredData(json);

          setJson(filtered);
        };
        reader.readAsText(file);
      }
    }
  };

  const csvJSON = (csv?: string) => {
    if (!csv) return console.error("CSV is empty");

    const bankType = checkBankType(csv);
    let formattedData: IData[] = [];

    if (bankType === "mercadoPago") {
      formattedData = formatMercadoPagoCSV(csv);
    }

    if (bankType === "nubank") {
      formattedData = formatNubankCSV(csv);
    }

    if (bankType === "xp") {
      formattedData = formatXpCSV(csv);
    }

    return formattedData;
  };

  const filteredData = (json: IData[]) => {
    const filtered = json?.filter((item: any) => {
      const local = item["Estabelecimento"];

      const removed = selectedToDelete.some((selected) => {
        return selected["Identificador"] === item["Identificador"];
      });

      return !!local && !removed;
    });

    return filtered;
  };

  const handleSaveJSON = async () => {
    setLoading(true);
    try {
      // const token = await user?.getIdToken();
      // if (!token) return;

      // const response = await fetch(`/api/save`, {
      //   method: "POST",
      //   body: JSON.stringify(file),
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      //   credentials: "include",
      // });

      // const { data } = await response.json();

      // if (!data) return;

      const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedData: IData[] = dataString ? JSON.parse(dataString) : [];

      const removedDuplicates = json.filter((savedItem) => {
        return !savedData.some(
          (newItem) => newItem["Identificador"] === savedItem["Identificador"]
        );
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...savedData, ...removedDuplicates])
      );

      setJson([]);
      fileRef.current!.value = "";
      push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectToDelete = (item: IData) => {
    const isSelected = selectedToDelete.includes(item);

    if (isSelected) {
      const filtered = selectedToDelete.filter(
        (selectedItem) => selectedItem !== item
      );
      setSelectedToDelete(filtered);
    } else {
      setSelectedToDelete([...selectedToDelete, item]);
    }
  };

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      <div className="flex w-full flex-col gap-5 p-2 mt-20">
        <label className="w-full border border-green-500 border-dashed h-32 relative ">
          <p className="w-full h-full absolute flex items-center justify-center ">
            {fileRef.current?.files?.[0]?.name
              ? fileRef.current.files[0].name
              : "Selecione ou arraste o arquivo aqui"}
          </p>
          <input
            className="w-full h-full absolute z-10 opacity-0"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileRef}
          />
        </label>
      </div>

      <div className="flex items-center justify-between w-full p-2 my-3 ">
        <div className="text-gray-400 flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          Permitido apenas arquivos CSV
        </div>
        <button
          className={`w-36 rounded bg-green-600 text-white p-2 br-2 hover:bg-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSaveJSON}
        >
          Enviar
        </button>
      </div>

      {json.length > 0 && (
        <div className="flex gap-1 max-w-6xl w-full flex-col m-auto">
          <div className="sticky top-0 left-0 right-0 border max-sm:hidden py-3  bg-neutral-200">
            <div
              className={`grid grid-cols-5 text-center max-sm:grid-cols-5 max-sm:text-xs`}
            >
              {header.map((item) => (
                <span
                  key={item}
                  className={`flex ${
                    item === "Estabelecimento"
                      ? "col-span-2"
                      : "col-span-1 justify-center"
                  } items-center border-r-2 max-sm:border text-zinc-400`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {json?.map((item) => {
            const isSelected = selectedToDelete.includes(item);

            return (
              <button
                onClick={() => handleSelectToDelete(item)}
                key={v4()}
                className={`grid grid-cols-5  text-center bg-white p-5 rounded-md ${
                  isSelected ? "bg-red-100" : ""
                } `}
              >
                {header.map((headerItem) => (
                  <div
                    key={v4()}
                    className={`flex items-center justify-between flex-col ${
                      headerItem === "Estabelecimento"
                        ? "col-span-2"
                        : "col-span-1"
                    }`}
                  >
                    <span
                      className={`w-full flex items-center capitalize ${
                        headerItem === "Estabelecimento" ? "" : "justify-center"
                      } border-r-2 ${getColor(
                        item[headerItem as keyof IData],
                        headerItem as keyof IData
                      )}`}
                    >
                      {formatTableValue(
                        item[headerItem as keyof IData],
                        headerItem as keyof IData
                      )}
                    </span>
                  </div>
                ))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
