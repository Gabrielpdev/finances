"use client";

import { useContext, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { createRecurring } from "@/app/actions/recurring/create";
import { deleteRecurring } from "@/app/actions/recurring/delete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionsContext } from "@/providers/transactions";
import { IFormattedRecurringData, IRecurringData } from "@/types/data";

interface FormState {
  description: string;
  amount: string;
  day: string;
  holder: string;
  type: string;
  installment: string;
  categoryId: string;
}

const emptyForm: FormState = {
  description: "",
  amount: "",
  day: "",
  holder: "",
  type: "",
  installment: "",
  categoryId: "",
};

const formatAmount = (amount: number) =>
  amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function RecurringTransactions() {
  const { categories, recurringTransactions, refreshRecurringTransactions } =
    useContext(TransactionsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<IFormattedRecurringData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState<IFormattedRecurringData | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      editing
        ? {
            description: editing.description,
            amount: String(Math.abs(editing.amount)),
            day: String(editing.day),
            holder: editing.holder,
            type: editing.type,
            installment: editing.installment,
            categoryId: editing.categoryId,
          }
        : { ...emptyForm, categoryId: categories[0]?.id || "" },
    );
    setError("");
  }, [isOpen, editing, categories]);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (recurring: IFormattedRecurringData) => {
    setEditing(recurring);
    setIsOpen(true);
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(form.amount.replace(",", "."));
    const parsedDay = Number(form.day);

    if (!form.description.trim()) {
      setError("Informe uma descrição.");
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor maior que zero.");
    } else if (
      !Number.isInteger(parsedDay) ||
      parsedDay < 1 ||
      parsedDay > 31
    ) {
      setError("O dia deve ser um número inteiro entre 1 e 31.");
    } else if (
      !form.categoryId ||
      !categories.some((category) => category.id === form.categoryId)
    ) {
      setError("Selecione uma categoria válida.");
    } else {
      setError("");
      setIsSaving(true);
      const data: IRecurringData = {
        id: editing?.id || uuidv4(),
        description: form.description.trim(),
        amount: -Math.abs(parsedAmount),
        day: parsedDay,
        holder: form.holder.trim(),
        type: form.type.trim(),
        installment: form.installment.trim(),
        categoryId: form.categoryId,
      };

      try {
        await createRecurring(data);
        await refreshRecurringTransactions();
        toast.success(
          editing
            ? "Recorrência atualizada com sucesso!"
            : "Recorrência criada com sucesso!",
        );
        setIsOpen(false);
      } catch (saveError) {
        console.error("Erro ao salvar recorrência:", saveError);
        toast.error("Erro ao salvar recorrência.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteRecurring({ id: deleting.id });
      await refreshRecurringTransactions();
      toast.success("Recorrência excluída com sucesso!");
      setDeleting(null);
    } catch (deleteError) {
      console.error("Erro ao excluir recorrência:", deleteError);
      toast.error("Erro ao excluir recorrência.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mt-8 flex w-full flex-col border-t border-border pt-6">
      <div className="flex flex-wrap items-stretch justify-between gap-3 px-3 sm:items-center sm:px-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Transações recorrentes
          </h2>
          <p className="text-sm text-muted-foreground">
            Saídas automáticas organizadas por dia do mês.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={openCreate}
          disabled={!categories.length}
        >
          <Plus /> Nova recorrência
        </Button>
      </div>

      <div className="mt-4 grid gap-2 px-3 sm:px-5">
        {!recurringTransactions.length ? (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nenhuma transação recorrente cadastrada.
          </p>
        ) : (
          recurringTransactions.map((recurring) => (
            <div
              key={recurring.id}
              className="flex w-full flex-col gap-3 rounded-md border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="w-full sm:flex-1">
                <p className="font-medium">{recurring.description}</p>
                <p className="text-sm text-muted-foreground">
                  Dia {recurring.day} · {recurring.category.name} ·{" "}
                  {recurring.holder || "Sem titular"}
                  {recurring.type ? ` · ${recurring.type}` : ""}
                </p>
              </div>
              <strong className="whitespace-nowrap text-destructive">
                {formatAmount(recurring.amount)}
              </strong>
              <div className="flex shrink-0 self-end gap-1 sm:self-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(recurring)}
                  title="Editar recorrência"
                  aria-label="Editar recorrência"
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleting(recurring)}
                  title="Excluir recorrência"
                  aria-label="Excluir recorrência"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && !isSaving && setIsOpen(false)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar recorrência" : "Nova recorrência"}
            </DialogTitle>
            <DialogDescription>
              Cadastre uma saída fixa para o mês.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Descrição"
              id="recurring-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              disabled={isSaving}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Valor"
                id="recurring-amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                disabled={isSaving}
              />
              <Input
                label="Dia do mês"
                id="recurring-day"
                type="number"
                min="1"
                max="31"
                step="1"
                value={form.day}
                onChange={(event) => updateField("day", event.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Titular"
                id="recurring-holder"
                value={form.holder}
                onChange={(event) => updateField("holder", event.target.value)}
                disabled={isSaving}
              />
              <Input
                label="Tipo"
                id="recurring-type"
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Parcela"
                id="recurring-installment"
                value={form.installment}
                onChange={(event) =>
                  updateField("installment", event.target.value)
                }
                disabled={isSaving}
              />
              <div className="flex w-full flex-col gap-1">
                <Label htmlFor="recurring-category">Categoria</Label>
                <select
                  id="recurring-category"
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                  disabled={isSaving}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button
                className="w-full sm:w-auto"
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !isDeleting && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir &quot;{deleting?.description}
              &quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
