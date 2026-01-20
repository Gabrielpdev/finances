"use client";
import { useState, useRef } from "react";

import { IData } from "@/types/data";

import { useRouter } from "next/navigation";
import { checkBankType } from "@/utils/checkBankType";
import { formatXpCSV } from "@/helpers/formatBanksCSV/xpCSV";
import { formatNubankCSV } from "@/helpers/formatBanksCSV/nubankCSV";
import { formatMercadoPagoCSV } from "@/helpers/formatBanksCSV/mercadoPagoCSV";
import { DataTable } from "@/components/modules/dataTable";
import { HeaderTable } from "@/components/modules/headerTable";
import { createData } from "../actions/data/create";
import { listDatas } from "../actions/data/list";

export default function Import() {
  const { push } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // const { user } = useContext(UserContext);

  const [json, setJson] = useState<IData[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);

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

          setJson(json);
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

      const removed = selectedToDelete.some(
        (selected) => selected === item["Identificador"],
      );

      return !!local && !removed;
    });

    return filtered;
  };

  const handleSaveJSON = async () => {
    setLoading(true);
    try {
      const savedData = await listDatas();

      const removedDuplicates = json.filter((savedItem) => {
        return !savedData.some(
          (newItem) => newItem["Identificador"] === savedItem["Identificador"],
        );
      });
      const filtered = filteredData(removedDuplicates);

      if (filtered.length > 0) {
        await createData(filtered);
      }

      setJson([]);
      fileRef.current!.value = "";
      push("/home");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
          <HeaderTable />

          {json?.map((item) => (
            <DataTable
              item={item}
              selectedItemToExclude={selectedToDelete}
              setSelectedItemToExclude={setSelectedToDelete}
              key={item.Identificador}
            />
          ))}
        </div>
      )}
    </div>
  );
}
