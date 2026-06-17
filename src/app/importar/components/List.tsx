import { IData, IFormattedData } from "@/types/data";
import { PiXCircleLight } from "react-icons/pi";
import { PiPencilSimple } from "react-icons/pi";
import { header } from "@/constants/tableHeader";
import { cn } from "@/lib/utils/cn";
import { useContext, useState } from "react";
import { TransactionsContext } from "@/providers/transactions";
import { TableValue } from "@/components/elements/tableValue";

export interface DataTableProps {
  item: IFormattedData;
  selectedItemToExclude?: string[];
  setSelectedItemToExclude?: React.Dispatch<React.SetStateAction<string[]>>;
  onEdit?: (item: IFormattedData) => void;
}

export function List({
  item,
  selectedItemToExclude,
  setSelectedItemToExclude,
  onEdit,
}: DataTableProps) {
  const [changes, setChanges] = useState<{
    label: string;
    value: string | undefined;
  }>({
    label: item.category.name,
    value: item.category.id,
  });

  const onSelectItemToExclude = (itemId: string) => {
    if (!selectedItemToExclude || !setSelectedItemToExclude) return;

    const updatedExcludedItems = [...selectedItemToExclude];

    if (updatedExcludedItems.includes(itemId)) {
      const index = updatedExcludedItems.indexOf(itemId);
      updatedExcludedItems.splice(index, 1);
    } else {
      updatedExcludedItems.push(itemId);
    }

    setSelectedItemToExclude(updatedExcludedItems);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(43,_minmax(0,_1fr))] text-center bg-white p-5 pr-2 rounded-md w-full",
        "max-sm:gap-4 max-sm:grid-cols-[repeat(2,_minmax(0,_1fr))] max-sm:flex-wrap max-sm:justify-center max-sm:relative max-sm:p-2 max-sm:py-2 max-sm:pl-2",
        selectedItemToExclude?.includes(item.id) && "opacity-60",
        item.description
          ?.toLocaleLowerCase()
          .includes("conta banco santander") && "bg-yellow-200",
      )}
    >
      {header.map((headerItem) => (
        <div
          key={headerItem}
          className={cn(
            `flex items-center justify-between flex-col`,
            headerItem === "Estabelecimento"
              ? "col-[span_21] max-sm:col-[span_2]"
              : "col-[span_6] max-sm:col-[span_2]",
            (headerItem === "Categoria" || headerItem === "Data") &&
              "max-sm:col-[span_1]",
          )}
        >
          <TableValue
            item={item}
            type={headerItem as keyof IData}
            changes={changes}
          />
        </div>
      ))}
      {onEdit && (
        <button
          onClick={() => onEdit(item)}
          className={`flex items-center justify-center flex-col col-span-2 w-full h-[34px] max-sm:w-[34px] max-sm:px-2 max-sm:absolute max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:right-12 max-sm:text-2xl text-green-600 hover:text-green-700`}
        >
          <PiPencilSimple />
        </button>
      )}
      {setSelectedItemToExclude && (
        <button
          onClick={() => onSelectItemToExclude(item.id)}
          className={`flex items-center justify-center flex-col col-span-2  w-full h-[34px] max-sm:w-[34px] max-sm:px-2 max-sm:absolute max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:right-3 max-sm:text-2xl`}
        >
          <PiXCircleLight />
        </button>
      )}
    </div>
  );
}
