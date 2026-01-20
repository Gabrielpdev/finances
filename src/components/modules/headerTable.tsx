import { IData } from "@/types/data";
import { header } from "@/constants/tableHeader";

export interface DataTableProps {
  item: IData;
  selectedItemToExclude: string[];
  setSelectedItemToExclude: React.Dispatch<React.SetStateAction<string[]>>;
}

export function HeaderTable() {
  return (
    <div className="border py-3 bg-neutral-200 max-sm:hidden">
      <div
        className={`grid grid-cols-[repeat(40,_minmax(0,_1fr))] text-center`}
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
  );
}
