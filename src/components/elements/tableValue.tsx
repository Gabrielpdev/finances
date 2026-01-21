import PiIcons from "@/components/elements/icons";
import { getCategory } from "@/helpers/getCategory";
import { CategoriesContext } from "@/providers/categories";
import { IFormattedData } from "@/types/data";
import { useContext } from "react";

interface TableValueProps {
  item: IFormattedData;
  type: keyof IFormattedData;
}

export const getColor = (item: IFormattedData, type: keyof IFormattedData) => {
  const value = item[type];

  if (type === "Valor") {
    if (Number(value) < 0) return "text-red-500";

    return "text-green-600";
  }
  return "text-blue-950";
};

export const TableValue = ({ item, type }: TableValueProps) => {
  const { categories } = useContext(CategoriesContext);

  const className = `w-full flex gap-1 items-center capitalize justify-center border-r-2 ${getColor(
    item,
    type,
  )} max-sm:px-2`;
  const value = item[type as keyof IFormattedData];

  // if (!value) return;

  if (type === "Estabelecimento") {
    const establishmentClassName = `w-full flex items-center capitalize border-r-2 text-blue-950 max-sm:px-2 max-sm:w-full max-sm:justify-center`;

    if (item["Parcela"]) {
      const parcelaFormatted = `${value} ${
        item["Parcela"] !== "-" ? `(${item["Parcela"]})` : ""
      }`;

      return <span className={establishmentClassName}>{parcelaFormatted}</span>;
    }

    return <span className={establishmentClassName}>{value.toString()}</span>;
  }

  if (type === "Valor") {
    const currencyValue = Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return (
      <span className={`${className} max-sm:border-l-2`}>{currencyValue}</span>
    );
  }

  if (type === "Categoria") {
    const estabelecimento = item["Estabelecimento"];
    const category = getCategory(estabelecimento, categories);

    return (
      <span className={className}>
        {category.name}
        <PiIcons iconName={category.icon} />{" "}
      </span>
    );
  }

  return <span className={className}>{value.toString()}</span>;
};
