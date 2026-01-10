"use client";
import { RefObject } from "react";

import { useRouter } from "next/navigation";
import { ICategory } from "@/types/data";

import PiIcons from "@/components/elements/icons";

interface CategoryProps {
  isEditing: string;
  category: ICategory;
  inputNameRef: RefObject<HTMLInputElement>;
  inputIconRef: RefObject<HTMLInputElement>;
  className?: string;
}

export default function ListItem({
  isEditing,
  category,
  inputIconRef,
  inputNameRef,
  className,
}: CategoryProps) {
  const { push } = useRouter();

  const handleSelectCategory = (category: string) => {
    push(`/categorias/${category.toLocaleLowerCase()}`);
  };

  if (isEditing === category.id) {
    return (
      <div
        className={`grid grid-cols-10 text-center bg-white p-5 rounded-md w-full ${className}`}
      >
        <input
          ref={inputNameRef}
          defaultValue={category.name}
          className={`w-full flex capitalize col-span-8 border-r-2 text-blue-950`}
        />
        <input
          ref={inputIconRef}
          defaultValue={category.icon}
          className={`w-full flex items-center col-span-2 capitalize justify-center border-r-2 text-blue-950 text-center`}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => handleSelectCategory(category.name)}
      className={`grid grid-cols-10 text-center bg-white p-5 rounded-md w-full  ${className}`}
    >
      <span
        className={`w-full flex items-center capitalize  col-span-9 border-r-2 text-blue-950 text-xl`}
      >
        {category.name}
      </span>
      <span
        className={`w-full flex items-center capitalize justify-center border-r-2 text-blue-950 text-4xl`}
      >
        <PiIcons iconName={category.icon} />
      </span>
    </button>
  );
}
