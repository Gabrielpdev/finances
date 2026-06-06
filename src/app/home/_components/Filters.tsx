"use client";
import { useContext } from "react";

import MultiSelect from "@/components/elements/multiSelect";
import Select from "@/components/elements/select";
import { TransactionsContext } from "@/providers/transactions";
import { DatePickerWithRange } from "@/components/elements/calendar";
import { Button } from "@/components/ui/button";
import { PiMagnifyingGlass, PiPen } from "react-icons/pi";
import { Switch } from "@/components/ui/switch";

const typesOptions = ["Xp", "Mercado Pago"];

interface IFiltersProps {
  setEnableEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFilterType: React.Dispatch<React.SetStateAction<string>>;
  selectedFilterType: string;
  selectedFilterCategory: string[];
  setSelectedFilterCategory: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Filters({
  setEnableEdit,
  setSelectedFilterType,
  selectedFilterType,
  selectedFilterCategory,
  setSelectedFilterCategory,
}: IFiltersProps) {
  const { categories, refreshTransactions, filterDate } =
    useContext(TransactionsContext);

  const searchWithFilters = () => {
    const from = filterDate?.from
      ? new Date(filterDate.from).getTime()
      : undefined;
    const to = filterDate?.to ? new Date(filterDate.to).getTime() : undefined;

    if (from && to) {
      refreshTransactions(from, to);
    }
  };

  return (
    <div className="flex items-end gap-5 p-2 max-sm:flex-wrap">
      <div className="flex gap-1  max-sm:w-full">
        <DatePickerWithRange />
      </div>

      <div className="flex gap-1  max-sm:w-full">
        <Select
          title="Todos"
          label="Tipo:"
          options={typesOptions}
          selected={selectedFilterType}
          onSelect={(value) => setSelectedFilterType(value)}
        />
      </div>

      <div className="flex gap-1  max-sm:w-full">
        <MultiSelect
          label="Categoria:"
          options={[...categories.map((cat) => cat.name), "Outros"]}
          selected={selectedFilterCategory}
          onSelect={(value) => setSelectedFilterCategory(value)}
        />
      </div>

      <div className="flex gap-1 justify-between items-end w-full">
        <Button
          className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white max-sm:w-[80%]"
          onClick={searchWithFilters}
        >
          Buscar
          <PiMagnifyingGlass />
        </Button>

        <Switch
          className=" max-sm:w-[20%]"
          label="Editar"
          onCheckedChange={(checked) => setEnableEdit(checked)}
        />
      </div>
    </div>
  );
}
