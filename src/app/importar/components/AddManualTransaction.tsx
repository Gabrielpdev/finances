"use client";

import { useState } from "react";
import { IData, ICategory } from "@/types/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";

interface AddManualTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: IData) => void;
  categories: ICategory[];
}

export function AddManualTransaction({
  isOpen,
  onClose,
  onAdd,
  categories,
}: AddManualTransactionProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    currentInstallment: "",
    totalInstallments: "",
    holder: "",
    amount: "",
    type: "debit",
    categoryId: categories[0]?.id || "",
  });

  const [loading, setLoading] = useState(false);

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

    if (!formData.description || !formData.amount || !formData.categoryId) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    const [year, month, day] = formData.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;

    // Se ambos os campos de parcela estiverem vazios, usar "-", senão usar "X de Y"
    const installmentString =
      formData.currentInstallment && formData.totalInstallments
        ? `${formData.currentInstallment} de ${formData.totalInstallments}`
        : "-";

    const newTransaction: IData = {
      id: uuidv4(),
      date: dateFormatted,
      description: formData.description,
      installment: installmentString,
      holder: formData.holder,
      amount:
        formData.type === "debit"
          ? -Math.abs(parseFloat(formData.amount))
          : Math.abs(parseFloat(formData.amount)),
      type: formData.type,
      categoryId: formData.categoryId,
      timestamp: new Date(formData.date).getTime(),
    };

    setLoading(false);
    onAdd(newTransaction);

    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      currentInstallment: "",
      totalInstallments: "",
      holder: "",
      amount: "",
      type: "debit",
      categoryId: categories[0]?.id || "",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Transação Manual</DialogTitle>
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
              />
              <span className="text-gray-600 font-semibold">de</span>
              <Input
                type="number"
                name="totalInstallments"
                value={formData.totalInstallments}
                onChange={handleChange}
                min="1"
                placeholder="Total"
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {formData.currentInstallment && formData.totalInstallments
                ? `Parcela ${formData.currentInstallment} de ${formData.totalInstallments}`
                : "Sem parcelas"}
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
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
