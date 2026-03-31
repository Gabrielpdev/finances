"use client";
import { useState, useEffect, useRef, useContext, useCallback } from "react";

import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";
import { ICategory } from "@/types/data";
import { PiPlusCircleDuotone, PiTrashSimpleDuotone } from "react-icons/pi";
import { toast } from "react-toastify";
import { updateCategories } from "@/app/actions/categories/update";
import { TransactionsContext } from "@/providers/transactions";
import { deleteCategories } from "@/app/actions/categories/delete";
import { ColorPicker } from "@/components/ui/color-picker";

export default function CategoryName() {
  const params = useParams();

  const newCategoryItemRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [color, setColor] = useState<string>("#FFFFFF");

  const [loading, setLoading] = useState(true);
  const [addField, setAddField] = useState(false);

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

      if (newCategoryItemRef?.current?.value && selectedCategory) {
        const value = newCategoryItemRef.current.value;
        const newCategoryData: ICategory = {
          ...selectedCategory,
          list: [value, ...selectedCategory.list],
        };

        await updateCategories({
          id: selectedCategory.id,
          data: newCategoryData,
        });

        const newCategories = categories.map((category) => {
          if (category.id === selectedCategory?.id) {
            if (category.list.includes(value)) {
              toast.error("Valor já existe na lista");
              return category;
            }

            return newCategoryData;
          }

          return category;
        });

        setCategories(newCategories);
        setSelectedCategory(newCategoryData);
        setAddField(false);
        updateLocalData({
          savedCategories: newCategories,
        });
        toast.success("Valor adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Failed to add value on list:", error);
      setCategories(categories);
      toast.error("Falha ao adicionar valor na lista.");
    }
  };

  const handleDeleteValueOnList = async (name: string) => {
    try {
      if (!confirm("Tem certeza que deseja deletar este item?")) return;

      if (selectedCategory) {
        const newList = selectedCategory.list.filter((item) => item !== name);
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
                  onClick={() => setAddField(true)}
                  className="flex items-center justify-center gap-2 text-white bg-green-700 rounded-md my-3 py-2 font-extrabold col-span-2 max-sm:col-span-3"
                >
                  Adicionar
                  <PiPlusCircleDuotone className="max-sm:text-2xl" />
                </button>
              )}
            </div>

            {addField && (
              <form
                onSubmit={handleSaveNewValueOnList}
                className="flex text-blue-950 w-full mb-3 bg-white p-2 rounded-md "
              >
                <input
                  ref={newCategoryItemRef}
                  type="text"
                  className="flex text-blue-950 w-full p-2 "
                />
                <button
                  type="submit"
                  className="text-white bg-green-700 rounded-md px-4 font-extrabold"
                >
                  Salvar
                </button>
              </form>
            )}

            <div className="grid gap-2 max-h-96 overflow-auto pb-4 pr-4">
              {selectedCategory?.list.map((category) => (
                <div
                  key={category}
                  className="grid grid-cols-10 text-center bg-white p-3 rounded-md text-blue-950 max-sm:py-3"
                >
                  <span
                    className={`w-full flex items-center capitalize col-span-8`}
                  >
                    {category}
                  </span>

                  <button
                    onClick={() => handleDeleteValueOnList(category)}
                    className="flex items-center justify-center gap-2 text-white bg-red-700 rounded-md py-2 col-span-2"
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
