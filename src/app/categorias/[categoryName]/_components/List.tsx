/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useContext, SetStateAction, Dispatch } from "react";

import { ICategory, ICategoryListItem } from "@/types/data";
import { toast } from "react-toastify";
import { updateCategories } from "@/app/actions/categories/update";
import { TransactionsContext } from "@/providers/transactions";
import {
  PiPlusCircleDuotone,
  PiTrashSimpleDuotone,
  PiPencilSimple,
} from "react-icons/pi";
import { Input } from "@/components/ui/input";

interface CategoryListProps {
  selectedCategory: ICategory | undefined;
  updateCategoryDataLocally: (newCategoryData: ICategory) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryList({
  selectedCategory,
  updateCategoryDataLocally,
  setLoading,
}: CategoryListProps) {
  const [editingListItem, setEditingListItem] =
    useState<ICategoryListItem | null>(null);
  const [addField, setAddField] = useState(false);

  const { setCategories, categories, updateLocalData } =
    useContext(TransactionsContext);

  const handleSaveNewValueOnList = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      const { key, alias } = event.target as typeof event.target & {
        key: { value: string };
        alias: { value: string };
      };

      const keyValue = key?.value?.trim();
      const aliasValue = alias?.value?.trim();

      if (!keyValue || !aliasValue || !selectedCategory) {
        toast.error("Chave e apelido são obrigatórios");
        return;
      }

      // Validar se a chave já existe (exceto se estiver editando o mesmo item)
      const keyExists = selectedCategory.list.some(
        (item) => item.key === keyValue && item.key !== editingListItem?.key,
      );

      if (keyExists) {
        toast.error("Esta chave já existe na lista");
        return;
      }

      setLoading(true);

      let newList: ICategory["list"];

      if (editingListItem) {
        // Modo edição: atualizar item existente
        newList = selectedCategory.list.map((item) => {
          if (item.key === editingListItem.key) {
            return { key: keyValue, alias: aliasValue };
          }
          return item;
        });
      } else {
        // Modo adição: adicionar novo item
        newList = [
          { key: keyValue, alias: aliasValue },
          ...selectedCategory.list,
        ];
      }

      const newCategoryData: ICategory = {
        ...selectedCategory,
        list: newList,
      };

      await updateCategories({
        id: selectedCategory.id,
        data: newCategoryData,
      });

      const newCategories = categories.map((category) => {
        if (category.id === selectedCategory?.id) {
          return newCategoryData;
        }

        return category;
      });

      setCategories(newCategories);
      setAddField(false);
      setEditingListItem(null);
      updateLocalData({
        savedCategories: newCategories,
      });
      toast.success(
        editingListItem
          ? "Item editado com sucesso!"
          : "Valor adicionado com sucesso!",
      );
    } catch (error) {
      console.error("Failed to save value on list:", error);
      setCategories(categories);
      toast.error("Falha ao salvar item na lista.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteValueOnList = async (key: string) => {
    try {
      if (!confirm("Tem certeza que deseja deletar este item?")) return;

      setLoading(true);
      if (selectedCategory) {
        const newList = selectedCategory.list.filter(
          (item) => item.key !== key,
        );
        const newCategoryData: ICategory = {
          ...selectedCategory,
          list: newList,
        };

        await updateCategories({
          id: selectedCategory.id,
          data: newCategoryData,
        });

        setAddField(false);
        updateCategoryDataLocally(newCategoryData);
        toast.success("Item deletado com sucesso!");
      }
    } catch (error) {
      console.error("Failed to delete value on list:", error);
      setCategories(categories);
      toast.error("Falha ao deletar item na lista.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditValueOnList = (key: string) => {
    const itemToEdit = selectedCategory?.list.find((item) => item.key === key);
    if (itemToEdit) {
      setEditingListItem(itemToEdit);
      setAddField(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingListItem(null);
    setAddField(false);
  };

  return (
    <div className={`flex flex-col w-full gap-2`}>
      <div className={`grid grid-cols-10 w-full `}>
        <span
          className={`w-full flex  capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
        >
          Lista:
        </span>

        {!addField && (
          <button
            onClick={() => {
              setAddField(true);
              setEditingListItem(null);
            }}
            className="flex items-center justify-center gap-2 text-white bg-green-700 rounded-md py-2 font-extrabold col-span-2 max-sm:col-span-3 hover:bg-green-800"
          >
            Adicionar
            <PiPlusCircleDuotone className="max-sm:text-2xl" />
          </button>
        )}
      </div>

      {addField && (
        <form
          onSubmit={handleSaveNewValueOnList}
          className="flex flex-col text-blue-950 w-full mb-3 bg-white p-2 rounded-md gap-2"
        >
          <Input
            label="Chave:"
            id="key"
            type="text"
            defaultValue={editingListItem?.key || ""}
            placeholder="ex: mercado-pago"
          />

          <Input
            label="Apelido:"
            id="alias"
            type="text"
            defaultValue={editingListItem?.alias || ""}
            placeholder="ex: Mercado Pago"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="text-white bg-green-700 rounded-md px-4 py-2 font-extrabold hover:bg-green-800 flex-1"
            >
              {editingListItem ? "Atualizar" : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-white bg-gray-500 rounded-md px-4 py-2 font-extrabold hover:bg-gray-600 flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-2 max-h-[calc(100vh-370px)] overflow-auto pb-4 pr-4">
        {selectedCategory?.list.map((item) => (
          <div
            key={item.key}
            className="grid gap-2 grid-cols-2 text-center bg-white p-3 rounded-md text-blue-950 max-sm:py-3"
          >
            <div className="w-full flex flex-col items-start col-span-2 max-sm:col-span-6 gap-1">
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-500 font-semibold">
                  Apelido:
                </span>
                <span className="capitalize">{item.alias}</span>
              </div>
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-500 font-semibold">
                  Chave:
                </span>
                <span className="font-mono text-sm">{item.key}</span>
              </div>
            </div>

            <button
              onClick={() => handleEditValueOnList(item.key)}
              className="flex items-center justify-center gap-2 text-white bg-blue-950 rounded-md py-2 col-span-1  hover:bg-blue-900"
            >
              <span className="font-extrabold text-sm max-sm:hidden">
                Editar
              </span>
              <PiPencilSimple className="max-sm:text-xl" />
            </button>

            <button
              onClick={() => handleDeleteValueOnList(item.key)}
              className="flex items-center justify-center gap-2 text-white bg-red-700 rounded-md py-2 col-span-1  hover:bg-red-800"
            >
              <span className="font-extrabold text-sm max-sm:hidden">
                Deletar
              </span>
              <PiTrashSimpleDuotone className="max-sm:text-xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
