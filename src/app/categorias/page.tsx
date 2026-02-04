"use client";
import { useState, useRef, useContext } from "react";
import * as Icons from "react-icons/pi";

import { v4 } from "uuid";
import ListItem from "./components/ListItem";
import { deleteCategories } from "../actions/categories/delete";
import { updateCategories } from "../actions/categories/update";
import { ICategory } from "@/types/data";
import { createCategories } from "../actions/categories/create";
import { TransactionsContext } from "@/providers/transactions";
import { toast } from "react-toastify";

export default function Category() {
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputIconRef = useRef<HTMLInputElement>(null);
  const inputColorRef = useRef<HTMLInputElement>(null);

  const { setCategories, categories, updateLocalTransactions } =
    useContext(TransactionsContext);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState("");

  const handleToggleEdit = (id: string) => {
    if (isEditing === id) {
      handleEditCategory(id);
    }
    setIsEditing(isEditing === id ? "" : id);
  };

  const handleSaveNewCategory = async () => {
    if (isAdding) {
      if (inputNameRef?.current?.value && inputIconRef?.current?.value) {
        const newCategory = {
          id: v4(),
          name: inputNameRef?.current?.value,
          icon: inputIconRef?.current?.value,
          color: inputColorRef?.current?.value || "#FFFFFF",
          list: [],
        } as ICategory;

        const newCategories = [...categories, newCategory];

        setCategories(newCategories);
        setIsEditing("");

        try {
          await createCategories(newCategory);
          updateLocalTransactions();

          toast.success("Categoria criada com sucesso!");
        } catch (error) {
          console.error("Failed to create category:", error);
          setCategories(categories);
          toast.error("Falha ao criar categoria.");
        }
      }
    }

    setIsAdding(!isAdding);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

    const newCategories = categories.filter((category) => category.id !== id);

    setCategories(newCategories);

    try {
      await deleteCategories({ id });
      updateLocalTransactions();

      toast.success("Categoria deletada com sucesso!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      setCategories(categories);
      toast.error("Falha ao deletar categoria.");
    }
  };

  const handleEditCategory = async (id: string) => {
    const name = inputNameRef?.current?.value;
    const icon = inputIconRef?.current?.value;
    const color = inputColorRef?.current?.value || "#ffffff";

    if (!name || !icon) return;

    let foundCategory: ICategory | null = null;
    const newCategories = categories.map((category) => {
      if (category.id === id) {
        foundCategory = category;
        return {
          ...category,
          name,
          icon,
          color,
        };
      }
      return category;
    });

    if (!foundCategory) return;

    setCategories(newCategories);
    setIsEditing("");

    try {
      await updateCategories({
        id,
        data: {
          ...(foundCategory as ICategory),
          name,
          icon,
          color,
        },
      });
      updateLocalTransactions();
      toast.success("Categoria atualizada com sucesso!");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Falha ao atualizar categoria.");
      setCategories(categories);
    }
  };

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      <div className={`max-sm:p-4 w-full flex flex-col mb-20`}>
        <div className={`grid grid-cols-11 my-2`}>
          <span
            className={`w-full flex items-center text-blue-950 m-2 col-span-9`}
          >
            Nome
          </span>

          <span
            className={`w-full flex items-center justify-center text-blue-950`}
          >
            Icone
          </span>

          <button
            onClick={handleSaveNewCategory}
            className="flex items-center justify-center gap-2 text-white bg-green-700 rounded-md my-3 p-2 text-sm font-extrabold max-sm:col-span-11 max-sm:-order-1"
          >
            {isAdding ? (
              <>
                Salvar <Icons.PiCheckCircleDuotone />
              </>
            ) : (
              <>
                Adicionar <Icons.PiPlusCircleDuotone />
              </>
            )}
          </button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleSaveNewCategory}
            className={`grid grid-cols-11 text-center bg-white p-5 rounded-md w-full mb-2`}
          >
            <input
              ref={inputNameRef}
              className={`w-full flex capitalize col-span-9 border-r-2 text-blue-950`}
            />
            <input
              ref={inputColorRef}
              className={`w-full flex items-center capitalize justify-center border-r-2 text-blue-950`}
            />
            <input
              ref={inputIconRef}
              className={`w-full flex items-center capitalize justify-center border-r-2 text-blue-950`}
            />
          </form>
        )}

        <div className="grid gap-4">
          {categories.map((category) => (
            <div className="grid grid-cols-12 gap-2" key={category.id}>
              <ListItem
                className="col-span-11 max-sm:col-span-12"
                category={category}
                isEditing={isEditing}
                inputIconRef={inputIconRef}
                inputNameRef={inputNameRef}
                inputColorRef={inputColorRef}
              />
              <div className="flex flex-col items-center justify-center gap-1 w-full max-sm:col-span-12 max-sm:flex-row max-sm:gap-2 max-sm:pb-3 max-sm:border-b-2 max-sm:border-green-800">
                <button
                  onClick={() => handleToggleEdit(category.id)}
                  className="w-full flex items-center justify-center gap-2 text-white bg-yellow-600 rounded-md p-2 text-sm font-extrabold"
                >
                  {isEditing === category.id ? (
                    <>
                      Salvar <Icons.PiCheckCircleDuotone />
                    </>
                  ) : (
                    <>
                      Editar <Icons.PiNotePencilDuotone />
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className=" w-full flex items-center justify-center gap-2 text-white bg-red-600 rounded-md p-2 text-sm font-extrabold"
                >
                  Deletar
                  <Icons.PiTrashSimpleDuotone />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
