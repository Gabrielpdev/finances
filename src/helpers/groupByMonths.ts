import { months } from "@/constants/months";
import { IData, IShowedData } from "@/types/data";
import { formatToDate } from "@/utils/formatToDate";

export const groupByMonths = (data: IData[]) => {
  return data.reduce((acc, obj) => {
    if (!obj["Data"]) return acc;

    const date = formatToDate(obj);

    const monthKey = `${months[date.getMonth()]}-${date.getFullYear()}`;

    acc[monthKey] = acc[monthKey] || [];
    acc[monthKey].push(obj);

    return acc;
  }, {} as IShowedData);
};
