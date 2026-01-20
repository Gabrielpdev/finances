"use client";
import { useState, useEffect, useRef, useContext } from "react";

import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";
import { ICategory } from "@/types/data";
import { PiPlusCircleDuotone, PiTrashSimpleDuotone } from "react-icons/pi";
import { CategoriesContext } from "@/providers/categories";
import { toast } from "react-toastify";
import { updateCategories } from "@/app/actions/categories/update";

export default function CategoryName() {
  const params = useParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [addField, setAddField] = useState(false);

  const { setCategories, categories } = useContext(CategoriesContext);

  const readJsonFile = async () => {
    setLoading(true);
    try {
      const filtered = categories.find(
        (category) => category.name.toLocaleLowerCase() === params.categoryName,
      );

      setSelectedCategory(filtered || null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewValueOnList = async () => {
    if (inputRef?.current?.value && selectedCategory) {
      const value = inputRef.current.value;

      await updateCategories({
        id: selectedCategory.id,
        data: {
          ...selectedCategory,
          list: [...selectedCategory.list, value],
        },
      });

      const newCategories = categories.map((category) => {
        if (
          category.name.toLocaleLowerCase() ===
          selectedCategory?.name.toLocaleLowerCase()
        ) {
          if (category.list.includes(value)) {
            toast.error("Valor já existe na lista");
            return category;
          }

          return {
            ...category,
            list: [...category.list, value],
          };
        }

        return category;
      });

      setCategories(newCategories);
      setSelectedCategory({
        ...selectedCategory!,
        list: [...selectedCategory.list, value],
      });
      setAddField(false);
    }
  };

  const handleDeleteValueOnList = async (name: string) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    if (inputRef?.current?.value && selectedCategory) {
      const value = inputRef.current.value;

      await updateCategories({
        id: selectedCategory.id,
        data: {
          ...selectedCategory,
          list: selectedCategory.list.filter((item) => item !== name),
        },
      });

      const newCategories = categories.map((category) => {
        if (
          category.name.toLocaleLowerCase() ===
          selectedCategory?.name.toLocaleLowerCase()
        ) {
          if (category.list.includes(value)) {
            toast.error("Valor já existe na lista");
            return category;
          }

          return {
            ...category,
            list: [...category.list, value],
          };
        }

        return category;
      });

      setCategories(newCategories);
      setSelectedCategory({
        ...selectedCategory,
        list: selectedCategory.list.filter((item) => item !== name),
      });
      setAddField(false);
    }
  };

  useEffect(() => {
    readJsonFile();
  }, []);

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className={``}>
          <div className={`grid grid-cols-10 m-2 `}>
            <span
              className={`w-full flex items-center capitalize border-r-2 text-blue-950 m-2 col-span-9 max-sm:col-span-6`}
            >
              Nome
            </span>
            {!addField && (
              <button
                onClick={() => setAddField(true)}
                className="flex items-center justify-center gap-2 text-white bg-green-700 rounded-md my-3 py-2 font-extrabold max-sm:col-span-4"
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
                ref={inputRef}
                type="text"
                className="flex text-blue-950 w-full p-5 "
              />
              <button
                type="submit"
                className="text-white bg-green-700 rounded-md px-4 font-extrabold"
              >
                Salvar
              </button>
            </form>
          )}

          <div className="grid gap-2 ">
            {selectedCategory?.list.map((category) => (
              <div
                key={category}
                className="grid grid-cols-10 text-center bg-white p-5 rounded-md text-blue-950 max-sm:py-3"
              >
                <span
                  className={`w-full flex items-center capitalize col-span-9 `}
                >
                  {category}
                </span>

                <button
                  onClick={() => handleDeleteValueOnList(category)}
                  className="flex items-center justify-center gap-2 text-white bg-red-700 rounded-md py-2 "
                >
                  <span className="font-extrabold max-sm:hidden">Deletar</span>
                  <PiTrashSimpleDuotone className="max-sm:text-xl" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
