"use client";

import { IFormattedData } from "@/types/data";

export const groupCategories = (data: IFormattedData[]) => {
  const result: { name: string; value: number; fill: string }[] = [];
  let totalByCategories: Record<string, { value: number; fill: string }> = {
    Outros: { value: 0, fill: "#FFFFFF" },
  };

  data.forEach((item) => {
    if (item.category.name === "Salario") return;

    totalByCategories[item.category.name] = {
      value:
        (totalByCategories[item.category.name]?.value ?? 0) +
        Number(item.amount) * -1,
      fill: item.category.color,
    };
  });

  Object.entries(totalByCategories).forEach(([key, value]) => {
    result.push({
      name: key,
      value: Math.ceil(value.value),
      fill: value.fill,
    });
  });

  return result;
};
