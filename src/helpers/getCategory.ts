import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { ICategory } from "@/types/data";

export const getCategory = (value: string) => {
  const categoriesString = localStorage.getItem(
    `${LOCAL_STORAGE_KEY}_categories`
  );
  const categories = categoriesString ? JSON.parse(categoriesString) : [];

  const fined = categories.find((category: ICategory) =>
    category.list.some((item) => value.includes(item))
  );

  return fined
    ? {
        name: fined.name,
        icon: fined.icon,
      }
    : {
        name: "Outros",
        icon: "",
      };
};
