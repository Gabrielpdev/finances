import { IData } from "@/types/data";

export const getColor = (value: string | number, type: keyof IData) => {
  if (type === "Valor" && typeof value === "number") {
    if (value < 0) return "text-red-600";

    return "text-green-600";
  }
  return "text-blue-950";
};
