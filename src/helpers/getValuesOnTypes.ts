"use client";

import { IFormattedData } from "@/types/data";

export const groupTypes = (data: IFormattedData[]) => {
  const result: { name: string; value: number; fill: string }[] = [];

  let totalByCategories: Record<string, { value: number; fill: string }> = {};

  data.forEach((item) => {
    if (item.category.name === "Salario") return;

    totalByCategories[item.type] = {
      value:
        (totalByCategories[item.type]?.value ?? 0) + Number(item.amount) * -1,
      fill: item.type === "Xp" ? "#000" : "#3483fa",
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
