/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useContext, SetStateAction, Dispatch } from "react";

import { ICategory } from "@/types/data";
import { toast } from "react-toastify";
import { updateCategories } from "@/app/actions/categories/update";
import { TransactionsContext } from "@/providers/transactions";
import { deleteCategories } from "@/app/actions/categories/delete";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";

interface FormProps {
  selectedCategory: ICategory | undefined;
  updateCategoryDataLocally: (newCategoryData: ICategory) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryForm({
  selectedCategory,
  updateCategoryDataLocally,
  setLoading,
}: FormProps) {
  const [color, setColor] = useState<string>(
    selectedCategory?.color || "#FFFFFF",
  );

  const { setCategories, categories, updateLocalData } =
    useContext(TransactionsContext);

  const handleSaveCategory = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      const { name, icon, meta } = event.target as typeof event.target & {
        name: { value: string };
        icon: { value: string };
        meta: { value: number };
      };

      if (selectedCategory) {
        const newCategoryData: ICategory = {
          ...selectedCategory,
          name: name.value,
          color: color,
          icon: icon.value,
          goal: Number(meta.value),
        };
        setLoading(true);

        await updateCategories({
          id: selectedCategory.id,
          data: newCategoryData,
        });

        updateCategoryDataLocally(newCategoryData);
        toast.success("Categoria atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      setCategories(categories);
      toast.error("Falha ao atualizar categoria.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

    const newCategories = categories.filter(
      (category) => category.id !== selectedCategory.id,
    );

    try {
      setLoading(true);

      await deleteCategories({ id: selectedCategory.id });

      setCategories(newCategories);
      updateLocalData({
        savedCategories: newCategories,
      });

      toast.success("Categoria deletada com sucesso!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      setCategories(categories);
      toast.error("Falha ao deletar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full gap-3`}>
      <form
        onSubmit={handleSaveCategory}
        className={`flex flex-col w-full gap-3`}
      >
        <Input
          label="Nome:"
          id="name"
          defaultValue={selectedCategory?.name}
          type="text"
        />

        <div className="flex flex-col w-full gap-1">
          <label
            className={`w-full flex items-center capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
          >
            Cor:
          </label>
          <ColorPicker
            value={color}
            onChange={setColor}
            triggerClassName="bg-white h-10"
          />
        </div>

        <Input
          label="Icone:"
          id="icon"
          defaultValue={selectedCategory?.icon}
          type="text"
        />

        <Input
          label="Meta:"
          id="meta"
          defaultValue={selectedCategory?.goal}
          type="number"
        />

        <button
          type="submit"
          className="text-white bg-green-700 rounded-md p-2 font-extrabold hover:bg-green-800"
        >
          Salvar
        </button>
      </form>
      <button
        type="button"
        onClick={handleDeleteCategory}
        className="text-white bg-red-700 rounded-md p-2 font-extrabold hover:bg-red-800"
      >
        Deletar
      </button>
    </div>
  );
}
