import { IData } from "@/types/data";

export function formatToDate(item: IData): Date {
  const splinedDate = item.date.split("/");
  return new Date(`${splinedDate[1]}-${splinedDate[0]}-${splinedDate[2]}`);
}
