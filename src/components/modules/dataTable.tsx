import { IData, IFormattedData, IShowedData } from "@/types/data";
import { TableValue } from "../elements/tableValue";
import { PiXCircleLight } from "react-icons/pi";
import { header } from "@/constants/tableHeader";

export interface DataTableProps {
  item: IData;
  selectedItemToExclude: string[];
  setSelectedItemToExclude: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DataTable({
  item,
  selectedItemToExclude,
  setSelectedItemToExclude,
}: DataTableProps) {
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

  return (
    <div
      className={`grid grid-cols-[repeat(40,_minmax(0,_1fr))] text-center bg-white p-5 pr-1 rounded-md w-full ${
        selectedItemToExclude.includes(item.Identificador) ? "opacity-60" : ""
      } max-sm:flex max-sm:flex-wrap max-sm:justify-center max-sm:relative max-sm:p-0 max-sm:py-5 max-sm:pl-5`}
    >
      {header.map((headerItem) => (
        <div
          key={headerItem}
          className={`flex items-center justify-between flex-col ${
            headerItem === "Estabelecimento"
              ? "col-[span_21] max-sm:w-full"
              : "col-[span_6]"
          }`}
        >
          <TableValue item={item} type={headerItem as keyof IData} />
        </div>
      ))}
      <button
        onClick={() => onSelectItemToExclude(item.Identificador)}
        className={`flex items-center justify-center flex-col col-span-1 max-sm:px-2 max-sm:absolute max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:left-1 max-sm:text-2xl`}
      >
        <PiXCircleLight />
      </button>
    </div>
  );
}
