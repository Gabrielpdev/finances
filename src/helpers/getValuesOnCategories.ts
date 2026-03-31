"use client";

import { IFormattedData } from "@/types/data";

export const groupCategories = (data: IFormattedData[]) => {
  const result: { name: string; value: number; fill: string; goal: number }[] =
    [];
  let totalByCategories: Record<
    string,
    { value: number; fill: string; goal: number }
  > = {
    Outros: { value: 0, fill: "#FFFFFF", goal: 0 },
  };

  data.forEach((item) => {
    if (item.category.name === "Salario") return;

    totalByCategories[item.category.name] = {
      value:
        (totalByCategories[item.category.name]?.value ?? 0) +
        Number(item.amount) * -1,
      fill: item.category.color,
      goal: item.category.goal,
    };
  });

  Object.entries(totalByCategories).forEach(([key, value]) => {
    result.push({
      name: key,
      value: Math.ceil(value.value),
      fill: value.fill,
      goal: value.goal,
    });
  });

  return result;
};
