import { months } from "@/constants/months";
import { IFormattedData, IShowedData } from "@/types/data";
import { formatToDate } from "@/utils/formatToDate";

export const groupByMonths = (data: IFormattedData[]) => {
  return data.reduce((acc, obj) => {
    if (!obj.date) return acc;

    const date = formatToDate(obj);

    const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

    acc[monthKey] = acc[monthKey] || [];

    acc[monthKey].push(obj);

    return acc;
  }, {} as IShowedData);
};
