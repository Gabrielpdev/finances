"use client";

import { ICategory, IFormattedData } from "@/types/data";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00E396",
  "#775DD0",
];

export const groupCategories = (
  data: IFormattedData[],
  categories: ICategory[],
) => {
  const result = [];
  let totalByCategories: Record<string, number> = {};

  for (const category of categories) {
    data.forEach((item) => {
      if (!totalByCategories[category.name]) {
        totalByCategories[category.name] = 0;
      }

      if (item.Categoria.name === category.name) {
        totalByCategories[category.name] += Number(item.Valor) * -1;
      }

      if (item.Categoria.name === "Outros") {
        totalByCategories[`Outros`] =
          (totalByCategories[`Outros`] || 0) + Number(item.Valor) * -1;
      }
    });

    if (category.name !== "Salario") {
      result.push({
        name: category.name,
        value: Math.ceil(totalByCategories[category.name] || 0),
        fill: COLORS[categories.indexOf(category) % COLORS.length],
      });
    }
  }

  result.push({
    name: `Outros`,
    value: Math.ceil(totalByCategories[`Outros`] || 0),
    fill: COLORS[categories.length % COLORS.length],
  });

  return result;
};
