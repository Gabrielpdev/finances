"use client";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/data";

import PiIcons from "@/components/elements/icons";

interface CategoryProps {
  category: ICategory;
  className?: string;
}

export default function ListItem({ category, className }: CategoryProps) {
  const { push } = useRouter();

  const handleSelectCategory = (category: string) => {
    push(`/categorias/${category.toLocaleLowerCase()}`);
  };

  return (
    <button
      onClick={() => handleSelectCategory(category.name)}
      className={`grid grid-cols-10 text-center p-5 rounded-md w-full ${className}`}
      style={{ backgroundColor: category?.color || "#FFFFFF" }}
    >
      <span
        className={`w-full flex items-center capitalize col-span-9 border-r-2 text-blue-950 text-xl`}
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
