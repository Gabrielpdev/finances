"use client";
import { useContext } from "react";

import ListItem from "./components/ListItem";
import { TransactionsContext } from "@/providers/transactions";

export default function Category() {
  const { categories } = useContext(TransactionsContext);

  return (
    <div className="flex max-w-6xl w-full flex-col m-auto">
      <div className={`max-sm:p-4 w-full flex flex-col mb-20`}>
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
    </div>
  );
}
