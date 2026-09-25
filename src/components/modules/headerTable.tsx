import { IData } from "@/types/data";
import { header } from "@/constants/tableHeader";

export interface DataTableProps {
  item: IData;
  selectedItemToExclude: string[];
  setSelectedItemToExclude: React.Dispatch<React.SetStateAction<string[]>>;
}

export function HeaderTable() {
  return (
    <div className="w-full border-y border-border bg-muted rounded-xl py-3 px-5 pr-2 max-sm:hidden">
      <div className="grid grid-cols-41 text-center ">
        {header.map((item) => (
          <span
            key={item}
            className={`flex ${
              item === "Estabelecimento"
                ? "col-[span_21]"
                : "col-[span_6] justify-center"
            } items-center border-r border-border text-muted-foreground`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
