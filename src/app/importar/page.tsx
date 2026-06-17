"use client";
import { useState, useRef, useContext } from "react";

import { IData, IFormattedData } from "@/types/data";

import { useRouter } from "next/navigation";
import { checkBankType } from "@/utils/checkBankType";
import { formatXpCSV } from "@/helpers/formatBanksCSV/xpCSV";
import { formatNubankCSV } from "@/helpers/formatBanksCSV/nubankCSV";
import { formatMercadoPagoCSV } from "@/helpers/formatBanksCSV/mercadoPagoCSV";
import { HeaderTable } from "@/components/modules/headerTable";
import { createData } from "../actions/data/create";
import { TransactionsContext } from "@/providers/transactions";
import { AddManualTransaction } from "./components/AddManualTransaction";
import { EditManualTransaction } from "./components/EditManualTransaction";
import { removeDuplicates, removeSelectedItem } from "./helpers/formaters";
import { List } from "./components/List";
import { addAllFutureInstallments } from "@/helpers/addFutureInstallments";
import { transactionsWithCategories } from "@/helpers/transactionsWithCategories";

export default function Import() {
  const { push } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [transactionWithCategories, setTransactionWithCategories] = useState<
    IFormattedData[]
  >([]);
  const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<IFormattedData | null>(null);

  const { transactions, categories, refreshTransactions } =
    useContext(TransactionsContext);

  const handleFileChange = (e: any) => {
    e.preventDefault();

    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e?.target?.result as string;
          const json = csvJSON(content);
          const transactions = transactionsWithCategories(json, categories);
          setTransactionWithCategories(transactions);
        };
        reader.readAsText(file);
      }
    }
  };

  const csvJSON = (csv?: string) => {
    if (!csv) {
      console.error("CSV is empty");
      return [];
    }

    const bankType = checkBankType(csv);
    let formattedData: IData[] = [];

    if (bankType === "mercadoPago") {
      formattedData = formatMercadoPagoCSV(csv, categories);
    }

    if (bankType === "nubank") {
      formattedData = formatNubankCSV(csv, categories);
    }

    if (bankType === "xp") {
      formattedData = formatXpCSV(csv, categories);
    }

    return formattedData;
  };

  const handleSaveJSON = async () => {
    setLoading(true);
    try {
      const removedDuplicates = removeDuplicates(
        transactionWithCategories,
        transactions,
      );
      const removedSelectedItem = removeSelectedItem(
        removedDuplicates,
        selectedToDelete,
      );

      if (removedSelectedItem.length > 0) {
        await Promise.all(
          removedSelectedItem.map(async (item) => {
            await createData(item);
          }),
        );

        await refreshTransactions();
      }

      setTransactionWithCategories([]);
      fileRef.current!.value = "";
      push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualTransaction = (newTransaction: IData) => {
    const transactionsWithFutureInstallments = addAllFutureInstallments([
      newTransaction,
    ]);
    const updatedJson = [
      ...transactionWithCategories,
      ...transactionsWithFutureInstallments,
    ];

    const formattedTransaction = transactionsWithCategories(
      updatedJson,
      categories,
    );
    setTransactionWithCategories(formattedTransaction);
  };

  const handleEditTransaction = async (updatedTransaction: IFormattedData) => {
    const updatedJson = transactionWithCategories.map((item) =>
      item.id === updatedTransaction.id ? updatedTransaction : item,
    );

    setTransactionWithCategories(updatedJson);
  };

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      <AddManualTransaction
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAdd={handleAddManualTransaction}
        categories={categories}
      />
      <EditManualTransaction
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        onEdit={handleEditTransaction}
        transaction={editingTransaction}
        categories={categories}
      />

      <div className="flex w-full flex-col gap-5 p-2 mt-20">
        <button
          className="w-full rounded bg-green-600 text-white p-2 hover:bg-green-700"
          onClick={() => setIsManualModalOpen(true)}
        >
          + Adicionar Transação Manual
        </button>
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

      {transactionWithCategories.length > 0 && (
        <div className="flex gap-1 max-w-6xl w-full flex-col m-auto">
          <HeaderTable />

          {transactionWithCategories?.map((item) => (
            <List
              item={item}
              selectedItemToExclude={selectedToDelete}
              setSelectedItemToExclude={setSelectedToDelete}
              key={item.id}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
