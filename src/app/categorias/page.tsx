"use client";
import { useContext, useState } from "react";

import ListItem from "./components/ListItem";
import { CreateCategoryModal } from "./components/CreateCategoryModal";
import { TransactionsContext } from "@/providers/transactions";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";

export default function Category() {
  const { categories, loading } = useContext(TransactionsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    <div className="w-full h-60 flex items-center justify-center">
      <Loading />
    </div>;
  }

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      <div className={`max-sm:p-4 w-full mt-4 flex flex-col mb-20`}>
        <div className="flex justify-end items-center px-5">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            + Nova Categoria
          </Button>
        </div>

        <div className={`grid grid-cols-10 my-2 px-5`}>
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
        </div>

        <div className="grid gap-2">
          {categories.map((category) => (
            <ListItem
              key={category.id}
              className="col-span-11 max-sm:col-span-12"
              category={category}
            />
          ))}
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
