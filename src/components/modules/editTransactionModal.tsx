"use client";

import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IData, ICategory, IFormattedData } from "@/types/data";
import { updateTransaction } from "@/app/actions/data/update";
import { deleteTransaction } from "@/app/actions/data/delete";
import { TransactionsContext } from "@/providers/transactions";
import { toast } from "react-toastify";

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: IFormattedData | null;
  categories: ICategory[];
  onClose: () => void;
  onDeleted: () => Promise<void>;
}

export function EditTransactionModal({
  isOpen,
  transaction,
  categories,
  onClose,
  onDeleted,
}: EditTransactionModalProps) {
  const { updateOneTransaction } = useContext(TransactionsContext);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!transaction) {
      setDescription("");
      setAmount("");
      setCategoryId("");
      setConfirmingDelete(false);
      return;
    }

    setDescription(transaction.description);
    setAmount(String(transaction.amount));
    setCategoryId(transaction.categoryId);
    setConfirmingDelete(false);
  }, [transaction, isOpen]);

  const currentCategoryExists = categories.some(
    (category) => category.id === categoryId,
  );
  const parsedAmount = Number(amount);
  const canSave =
    Boolean(transaction) &&
    Boolean(description.trim()) &&
    amount.trim() !== "" &&
    Number.isFinite(parsedAmount) &&
    currentCategoryExists;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!transaction || !canSave) return;

    setIsSaving(true);
    const updatedTransaction: IData = {
      ...transaction,
      description: description.trim(),
      amount: parsedAmount,
      categoryId,
    };

    try {
      await updateTransaction({ data: updatedTransaction });
      updateOneTransaction(updatedTransaction);
      toast.success("Transação atualizada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Erro ao atualizar transação!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    setIsDeleting(true);
    try {
      await deleteTransaction({ id: transaction.id });
      await onDeleted();
      toast.success("Item excluído com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Erro ao excluir item. Por favor, tente novamente.");
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving && !isDeleting) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        {confirmingDelete ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir &quot;{transaction?.description}
                &quot;?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmingDelete(false)}
                disabled={isDeleting}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Editar transação</DialogTitle>
              <DialogDescription>
                Altere somente os dados desta transação.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome exibido"
                id="transaction-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={isSaving}
              />
              <Input
                label="Valor"
                id="transaction-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={isSaving}
              />
              <div className="flex flex-col w-full gap-1">
                <Label htmlFor="transaction-category">Categoria</Label>
                <select
                  id="transaction-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!currentCategoryExists && (
                  <p className="text-sm text-red-600">
                    A categoria desta transação não está disponível.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={isSaving}
                >
                  Excluir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!canSave || isSaving}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
