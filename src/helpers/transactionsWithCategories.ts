import { ICategory, IData, IFormattedData } from "@/types/data";
import { defaultCategory, getCategory } from "./getCategory";

export const transactionsWithCategories = (
  savedData: IData[],
  savedCategories: ICategory[],
) => {
  let transactionsWithCategories: IFormattedData[] = [];

  for (const item of savedData) {
    if (item.categoryId !== "others") {
      const found = savedCategories.find(
        (category: ICategory) => category.id === item.categoryId,
      );

      transactionsWithCategories.push({
        ...item,
        category: found || defaultCategory,
      });
    } else {
      const estabelecimento = item.description;
      const category = getCategory(estabelecimento, savedCategories);

      transactionsWithCategories.push({
        ...item,
        category: category,
        categoryId: category.id,
      });
    }
  }

  return transactionsWithCategories;
};
