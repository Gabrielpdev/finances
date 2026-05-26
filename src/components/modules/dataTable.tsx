import { IData, IFormattedData } from "@/types/data";
import { TableValue } from "../elements/tableValue";
import { PiCheck, PiXCircleLight } from "react-icons/pi";
import { PiPencilSimple } from "react-icons/pi";
import { header } from "@/constants/tableHeader";
import { cn } from "@/lib/utils/cn";
import { useContext, useState } from "react";
import { updateTransaction } from "@/app/actions/data/update";
import { toast } from "react-toastify";
import { TransactionsContext } from "@/providers/transactions";

export interface DataTableProps {
  item: IFormattedData;
  selectedItemToExclude?: string[];
  setSelectedItemToExclude?: React.Dispatch<React.SetStateAction<string[]>>;
  shouldWarnXpItem?: boolean;
  onLongPress?: (item: IFormattedData) => void;
  enableEdit?: boolean;
  onEdit?: (item: IFormattedData) => void;
}

export function DataTable({
  item,
  selectedItemToExclude,
  setSelectedItemToExclude,
  shouldWarnXpItem,
  onLongPress,
  enableEdit,
  onEdit,
}: DataTableProps) {
  const { updateOneTransaction } = useContext(TransactionsContext);
  const [changes, setChanges] = useState<{
    label: string;
    value: string | undefined;
  }>({
    label: item.category.name,
    value: item.category.id,
  });

  const handleDoubleClick = () => {
    if (!onLongPress) return;
    onLongPress(item);
  };

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

  const handleUpdateTransaction = async () => {
    try {
      const updatedItem: IData = {
        amount: item.amount,
        categoryId: changes?.value || item.categoryId,
        date: item.date,
        description: item.description,
        id: item.id,
        timestamp: item.timestamp,
        type: item.type,
        holder: item.holder,
        installment: item.installment,
      };

      await updateTransaction({ data: updatedItem });
      updateOneTransaction(updatedItem);
      toast.success("Transação atualizada com sucesso!");
    } catch (error) {
      console.log("Error updating transaction:", error);
      toast.error("Erro ao atualizar transação!");
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(41,_minmax(0,_1fr))] text-center bg-white p-5 pr-2 rounded-md w-full",
        "max-sm:gap-4 max-sm:grid-cols-[repeat(2,_minmax(0,_1fr))] max-sm:flex-wrap max-sm:justify-center max-sm:relative max-sm:p-2 max-sm:py-2 max-sm:pl-2",
        selectedItemToExclude?.includes(item.id) && "opacity-60",
        shouldWarnXpItem &&
          item.description
            ?.toLocaleLowerCase()
            .includes("conta banco santander") &&
          "bg-yellow-200",
      )}
      onDoubleClick={handleDoubleClick}
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
            setChanges={enableEdit ? setChanges : undefined}
            changes={changes}
          />
        </div>
      ))}
      {!!setSelectedItemToExclude && !enableEdit && (
        <button
          onClick={() => onSelectItemToExclude(item.id)}
          className={`flex items-center justify-center flex-col col-span-2  w-full h-[34px] max-sm:w-[34px] max-sm:px-2 max-sm:absolute max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:right-3 max-sm:text-2xl`}
        >
          <PiXCircleLight />
        </button>
      )}
      {enableEdit && (
        <button
          disabled={changes.value === item.category.id}
          onClick={handleUpdateTransaction}
          className={`disabled:opacity-50 disabled:cursor-not-allowed bg-green-700 w-full h-[34px] ml-1 rounded-md text-xl hover:bg-green-800 flex items-center justify-center flex-col col-span-2 max-sm:w-[34px] max-sm:px-2 max-sm:absolute max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:right-3 max-sm:text-2xl`}
        >
          <PiCheck className="text-white" />
        </button>
      )}
    </div>
  );
}
