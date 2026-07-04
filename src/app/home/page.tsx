"use client";
import { useContext, useEffect, useMemo, useState } from "react";

import { IFormattedData } from "@/types/data";

import { Loading } from "@/components/loading";
import { formatToDate } from "@/utils/formatToDate";
import { groupByMonths } from "@/helpers/groupByMonths";
import { DataTable } from "@/components/modules/dataTable";
import { HeaderTable } from "@/components/modules/headerTable";
import { ConfirmDeleteModal } from "@/components/modules/confirmDeleteModal";

import { TransactionsContext } from "@/providers/transactions";
import { toast } from "react-toastify";
import { deleteTransaction } from "../actions/data/delete";
import Filters from "./_components/Filters";
import { CurrencyContext } from "@/providers/currency";

export default function Home() {
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

  const { calcValue } = useContext(CurrencyContext);
  const { transactions, refreshTransactions, loading } =
    useContext(TransactionsContext);

  const transactionsGrouped = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      return formatToDate(b).getTime() - formatToDate(a).getTime();
    });

    return groupByMonths(sorted);
  }, [transactions]);

  const filterData = useMemo(() => {
    const obje = Object.entries(transactionsGrouped);

    const data = obje.map(([key, data]) => {
      const filteredData = data
        .filter(
          (item) =>
            selectedFilterType === "" || selectedFilterType === item.type,
        )
        .filter((item) => {
          return (
            selectedFilterCategory.length === 0 ||
            selectedFilterCategory.includes(item.category.name)
          );
        });

      return [key, filteredData] as [string, IFormattedData[]];
    });

    return data as [string, IFormattedData[]][];
  }, [
    transactionsGrouped,
    selectedFilterType,
    selectedFilterCategory,
    selectedItemToExclude,
  ]);

  useEffect(() => {
    const allDatas = filterData.flatMap(([_, items]) => items);

    calcValue(allDatas, selectedItemToExclude);
  }, [filterData, selectedItemToExclude]);

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
      <Filters
        setEnableEdit={setEnableEdit}
        setSelectedFilterType={setSelectedFilterType}
        selectedFilterType={selectedFilterType}
        selectedFilterCategory={selectedFilterCategory}
        setSelectedFilterCategory={setSelectedFilterCategory}
      />

      {Object.entries(transactionsGrouped)?.[0]?.[0] && (
        <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
          <h2 className="text-base text-center">
            {Object.entries(transactionsGrouped)?.[0]?.[0]}
          </h2>
        </div>
      )}
      <HeaderTable />

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        filterData?.map(([key, month], index) => {
          return (
            <div key={key} className="gap-1 flex flex-col relative px-2">
              {index !== 0 && (
                <div className="flex w-full items-center justify-center text-zinc-400 py-4 sticky top-0">
                  <h2 className="text-base text-center">{key}</h2>
                </div>
              )}

              {month.map((item) => {
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
