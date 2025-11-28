import { IData } from "@/types/data";

export const formatTableValue = (value: number | string, type: keyof IData) => {
  if (!value) return value;

  if (type === "Valor") {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return value;
};
