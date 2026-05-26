/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef, useContext, useCallback } from "react";

import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";
import { ICategory } from "@/types/data";
import {
  PiPlusCircleDuotone,
  PiTrashSimpleDuotone,
  PiPencilSimple,
} from "react-icons/pi";
import { toast } from "react-toastify";
import { updateCategories } from "@/app/actions/categories/update";
import { TransactionsContext } from "@/providers/transactions";
import { deleteCategories } from "@/app/actions/categories/delete";
import { ColorPicker } from "@/components/ui/color-picker";

export default function CategoryName() {
  const params = useParams();

  const newCategoryKeyRef = useRef<HTMLInputElement>(null);
  const newCategoryAliasRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [color, setColor] = useState<string>("#FFFFFF");

  const [loading, setLoading] = useState(true);
  const [addField, setAddField] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const { setCategories, categories, updateLocalData } =
    useContext(TransactionsContext);

  const readJsonFile = useCallback(async () => {
    setLoading(true);
    try {
      const filtered = categories.find(
        (category) => category.name.toLocaleLowerCase() === params.categoryName,
      );

      setSelectedCategory(filtered || null);
      setColor(filtered?.color || "#FFFFFF");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [params.categoryName, categories]);

  const updateCategoryDataLocally = useCallback(
    async (newCategoryData: ICategory) => {
      const newCategories = categories.map((category) => {
        if (category.id === newCategoryData.id) {
          return newCategoryData;
        }

        return category;
      });

      setSelectedCategory(newCategoryData);
      setCategories(newCategories);
      setAddField(false);
      updateLocalData({
        savedCategories: newCategories,
      });
    },
    [categories],
  );

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
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

    const newCategories = categories.filter(
      (category) => category.id !== selectedCategory.id,
    );

    try {
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
    }
  };

  const handleSaveNewValueOnList = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      const keyValue = newCategoryKeyRef.current?.value?.trim();
      const aliasValue = newCategoryAliasRef.current?.value?.trim();

      if (!keyValue || !aliasValue || !selectedCategory) {
        toast.error("Chave e apelido são obrigatórios");
        return;
      }

      // Validar se a chave já existe (exceto se estiver editando o mesmo item)
      const keyExists = selectedCategory.list.some(
        (item) => item.key === keyValue && item.key !== editingKey,
      );

      if (keyExists) {
        toast.error("Esta chave já existe na lista");
        return;
      }

      let newList: ICategory["list"];

      if (editingKey) {
        // Modo edição: atualizar item existente
        newList = selectedCategory.list.map((item) => {
          if (item.key === editingKey) {
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
      setSelectedCategory(newCategoryData);
      setAddField(false);
      setEditingKey(null);
      updateLocalData({
        savedCategories: newCategories,
      });
      toast.success(
        editingKey
          ? "Item editado com sucesso!"
          : "Valor adicionado com sucesso!",
      );
    } catch (error) {
      console.error("Failed to save value on list:", error);
      setCategories(categories);
      toast.error("Falha ao salvar item na lista.");
    }
  };

  const handleDeleteValueOnList = async (key: string) => {
    try {
      if (!confirm("Tem certeza que deseja deletar este item?")) return;

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

        updateCategoryDataLocally(newCategoryData);
        toast.success("Item deletado com sucesso!");
      }
    } catch (error) {
      console.error("Failed to delete value on list:", error);
      setCategories(categories);
      toast.error("Falha ao deletar item na lista.");
    }
  };

  const handleEditValueOnList = (key: string) => {
    const itemToEdit = selectedCategory?.list.find((item) => item.key === key);
    if (itemToEdit) {
      setEditingKey(key);
      setAddField(true);
      // Preencher campos após o componente renderizar
      setTimeout(() => {
        if (newCategoryKeyRef.current) {
          newCategoryKeyRef.current.value = itemToEdit.key;
        }
        if (newCategoryAliasRef.current) {
          newCategoryAliasRef.current.value = itemToEdit.alias;
        }
      }, 0);
    }
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setAddField(false);
    if (newCategoryKeyRef.current) {
      newCategoryKeyRef.current.value = "";
    }
    if (newCategoryAliasRef.current) {
      newCategoryAliasRef.current.value = "";
    }
  };

  useEffect(() => {
    readJsonFile();
  }, [readJsonFile]);

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 gap-4 w-full mt-4 max-sm:grid-cols-1 max-sm:px-3`}
        >
          <div className={`flex flex-col w-full gap-3`}>
            <form
              onSubmit={handleSaveCategory}
              className={`flex flex-col w-full gap-3`}
            >
              <div className="flex flex-col w-full gap-1">
                <label
                  className={`w-full flex items-center capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
                >
                  Nome:
                </label>
                <input
                  // ref={inputRef}
                  id="name"
                  defaultValue={selectedCategory?.name}
                  type="text"
                  className="flex text-blue-950 w-full p-2 rounded-md"
                />
              </div>

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

              <div className="flex flex-col w-full gap-1">
                <label
                  className={`w-full flex items-center capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
                >
                  Icone:
                </label>
                <input
                  // ref={inputRef}
                  id="icon"
                  defaultValue={selectedCategory?.icon}
                  type="text"
                  className="flex text-blue-950 w-full p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  className={`w-full flex items-center capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
                >
                  Meta:
                </label>
                <input
                  // ref={inputRef}
                  defaultValue={selectedCategory?.goal}
                  id="meta"
                  type="number"
                  className="flex text-blue-950 w-full p-2 rounded-md"
                />
              </div>

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

          <div className={`flex flex-col w-full`}>
            <div className={`grid grid-cols-10 w-full`}>
              <span
                className={`w-full flex items-center capitalize border-r-2 text-blue-950 m-2 col-span-8 max-sm:col-span-7`}
              >
                Lista:
              </span>
              {!addField && (
                <button
                  onClick={() => {
                    setAddField(true);
                    setEditingKey(null);
                  }}
                  className="flex items-center justify-center gap-2 text-white bg-green-700 rounded-md my-3 py-2 font-extrabold col-span-2 max-sm:col-span-3 hover:bg-green-800"
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
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Chave:
                  </label>
                  <input
                    ref={newCategoryKeyRef}
                    type="text"
                    placeholder="ex: mercado-pago"
                    className="flex text-blue-950 w-full p-2 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Apelido:
                  </label>
                  <input
                    ref={newCategoryAliasRef}
                    type="text"
                    placeholder="ex: Mercado Pago"
                    className="flex text-blue-950 w-full p-2 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="text-white bg-green-700 rounded-md px-4 py-2 font-extrabold hover:bg-green-800 flex-1"
                  >
                    {editingKey ? "Atualizar" : "Adicionar"}
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
        </div>
      )}
    </div>
  );
}
