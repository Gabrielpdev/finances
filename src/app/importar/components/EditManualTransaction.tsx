"use client";

import { useState, useEffect } from "react";
import { IData, IFormattedData, ICategory } from "@/types/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { transactionsWithCategories } from "@/helpers/transactionsWithCategories";

interface EditManualTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (transaction: IFormattedData) => void;
  transaction: IFormattedData | null;
  categories: ICategory[];
}

export function EditManualTransaction({
  isOpen,
  onClose,
  onEdit,
  transaction,
  categories,
}: EditManualTransactionProps) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    currentInstallment: "-",
    totalInstallments: "-",
    holder: "",
    amount: "",
    type: "debit",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transaction) {
      setFormData({
        date: "",
        description: "",
        currentInstallment: "-",
        totalInstallments: "-",
        holder: "",
        amount: "",
        type: "debit",
        categoryId: "",
      });
      return;
    }

    const [day, month, year] = transaction.date.split("/");
    const [current, total] = transaction.installment.split(" de ");

    setFormData({
      date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      description: transaction.description,
      currentInstallment: current || "-",
      totalInstallments: total || "-",
      holder: transaction.holder,
      amount: transaction.amount.toString(),
      type: transaction.type,
      categoryId: transaction.categoryId,
    });
  }, [transaction, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !transaction ||
      !formData.description ||
      !formData.amount ||
      !formData.categoryId
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    const [day, month, year] = formData.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    const installmentString = `${formData.currentInstallment} de ${formData.totalInstallments}`;

    const updatedTransaction: IData = {
      id: transaction.id,
      date: dateFormatted,
      description: formData.description,
      installment: installmentString,
      holder: formData.holder,
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId,
      timestamp: new Date(formData.date).getTime(),
    };

    const formattedTransaction = transactionsWithCategories(
      [updatedTransaction],
      categories,
    );

    setLoading(false);
    onEdit(formattedTransaction[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="debit">Saída</option>
                <option value="credit">Entrada</option>
              </select>
            </div>
          </div>

          <Input
            label="Descrição *"
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Supermercado"
          />

          <Input
            label="Valor *"
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
          />

          <Input
            label="Titular"
            id="holder"
            type="text"
            name="holder"
            value={formData.holder}
            onChange={handleChange}
            placeholder="Ex: Conta Corrente"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId">Categoria *</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Parcelas</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                name="currentInstallment"
                value={formData.currentInstallment}
                onChange={handleChange}
                min="1"
                placeholder="Atual"
                disabled
              />
              <span className="text-gray-600 font-semibold">de</span>
              <Input
                type="number"
                name="totalInstallments"
                value={formData.totalInstallments}
                onChange={handleChange}
                min="1"
                placeholder="Total"
                disabled
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Parcela {formData.currentInstallment} de{" "}
              {formData.totalInstallments}
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
