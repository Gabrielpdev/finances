import { months } from "@/constants/months";
import { ICategory, IData, IShowedData } from "@/types/data";
import { formatToDate } from "@/utils/formatToDate";
import { getCategory } from "./getCategory";

export const groupByMonths = (data: IData[], categories: ICategory[]) => {
  return data.reduce((acc, obj) => {
    if (!obj.date) return acc;

    const date = formatToDate(obj);

    const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

    acc[monthKey] = acc[monthKey] || [];

    const category = getCategory(obj.description, categories);

    acc[monthKey].push({
      ...obj,
      category,
    });

    return acc;
  }, {} as IShowedData);
};
