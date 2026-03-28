"use client";
import { useCallback, useContext, useEffect, useState } from "react";

import { months } from "@/constants/months";
import { IFormattedData, IShowedData } from "@/types/data";

import { Loading } from "@/components/loading";
import { formatToDate } from "@/utils/formatToDate";
import { CurrencyContext } from "@/providers/currency";
import { groupByMonths } from "@/helpers/groupByMonths";
import { DataTable } from "@/components/modules/dataTable";
import { HeaderTable } from "@/components/modules/headerTable";
import { ConfirmDeleteModal } from "@/components/modules/confirmDeleteModal";

import { getCategory } from "@/helpers/getCategory";

import MultiSelect from "@/components/elements/multiSelect";
import Select from "@/components/elements/select";
import { TransactionsContext } from "@/providers/transactions";
import { DatePickerWithRange } from "@/components/elements/calendar";
import { Button } from "@/components/ui/button";
import { PiMagnifyingGlass, PiPen } from "react-icons/pi";
import { toast } from "react-toastify";
import { deleteTransaction } from "../actions/data/delete";

const typesOptions = ["Xp", "Mercado Pago"];

export default function Home() {
  const [showedData, setShowedData] = useState<IShowedData>({});

  const [loading, setLoading] = useState(true);

  const [selectedFilterType, setSelectedFilterType] = useState("");

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<
    string[]
  >([]);

  const [selectedItemToExclude, setSelectedItemToExclude] = useState<string[]>(
    [],
  );
  const [enableEdit, setEnableEdit] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IFormattedData | null>(null);

  const { setValue } = useContext(CurrencyContext);
  const { transactions, categories, refreshTransactions, filterDate } =
    useContext(TransactionsContext);

  const removeCreditDatas = useCallback((data: IFormattedData[]) => {
    try {
      const dateSet = new Set<string>();
      const typeSet = new Set<string>();

      for (const obj of data) {
        const date = formatToDate(obj);
        const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;
        dateSet.add(monthKey);
        typeSet.add(obj.type);
      }

      const sorted = [...data].sort((a, b) => {
        return formatToDate(b).getTime() - formatToDate(a).getTime();
      });

      const grouped = groupByMonths(sorted);
      setShowedData(grouped);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const readJsonFile = useCallback(async () => {
    setLoading(true);
    try {
      console.log(transactions);
      removeCreditDatas(transactions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [transactions, removeCreditDatas]);

  useEffect(() => {
    readJsonFile();
  }, [readJsonFile]);

  const formatTotalValue = useCallback(() => {
    let inTotal = 0;
    let outTotal = 0;

    for (const item of transactions) {
      if (selectedFilterType !== "" && selectedFilterType !== item.type) {
        continue;
      }

      const estabelecimento = item.description;
      const category = getCategory(estabelecimento, categories);
      if (
        selectedFilterCategory.length !== 0 &&
        !selectedFilterCategory.includes(category.name)
      ) {
        continue;
      }

      if (selectedItemToExclude.includes(item.id)) {
        continue;
      }

      const valorItem = Number(item.amount);
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
    transactions,
    categories,
    selectedFilterType,
    selectedFilterCategory,
    selectedItemToExclude,
    setValue,
  ]);

  useEffect(() => {
    formatTotalValue();
  }, [formatTotalValue]);

  const searchWithFilters = () => {
    const from = filterDate?.from
      ? new Date(filterDate.from).getTime()
      : undefined;
    const to = filterDate?.to ? new Date(filterDate.to).getTime() : undefined;

    if (from && to) {
      refreshTransactions(from, to);
    }
  };

  const handleDeleteItem = (item: IFormattedData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteTransaction({ id: itemToDelete.id });
      refreshTransactions();
      setDeleteModalOpen(false);
      setItemToDelete(null);
      toast.success("Item excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Erro ao excluir item. Por favor, tente novamente.");
    }
  };

  return (
    <div className="flex max-w-6xl w-full flex-col mt-24 m-auto">
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

        <Button
          className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white max-sm:w-full"
          onClick={searchWithFilters}
        >
          Buscar
          <PiMagnifyingGlass />
        </Button>

        <Button
          className="flex items-center justify-center bg-yellow-700 hover:bg-yellow-800 text-white max-sm:w-full"
          onClick={() => setEnableEdit((prev) => !prev)}
        >
          Editar
          <PiPen />
        </Button>
      </div>

      {Object.entries(showedData)?.[0]?.[0] && (
        <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
          <h2 className="text-base text-center">
            {Object.entries(showedData)?.[0]?.[0]}
          </h2>
        </div>
      )}
      <HeaderTable />

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        Object.entries(showedData)?.map(([key, month], index) => {
          return (
            <div key={key} className="gap-1 flex flex-col relative">
              {index !== 0 && (
                <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
                  <h2 className="text-base text-center">{key}</h2>
                </div>
              )}

              {month
                .filter(
                  (item) =>
                    selectedFilterType === "" ||
                    selectedFilterType === item.type,
                )
                .filter((item) => {
                  return (
                    selectedFilterCategory.length === 0 ||
                    selectedFilterCategory.includes(item.category.name)
                  );
                })
                .map((item) => {
                  return (
                    <DataTable
                      item={item}
                      selectedItemToExclude={selectedItemToExclude}
                      setSelectedItemToExclude={setSelectedItemToExclude}
                      enableEdit={enableEdit}
                      onLongPress={handleDeleteItem}
                      key={item.id}
                    />
                  );
                })}
            </div>
          );
        })
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir "${itemToDelete?.description}" ?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}
