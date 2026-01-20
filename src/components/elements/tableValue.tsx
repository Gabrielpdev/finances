import PiIcons from "@/components/elements/icons";
import { useGetCategory } from "@/helpers/getCategory";
import { IData } from "@/types/data";

interface TableValueProps {
  item: IData;
  type: keyof IData;
}

export const getColor = (item: IData, type: keyof IData) => {
  const value = item[type];

  if (type === "Valor") {
    if (Number(value) < 0) return "text-red-500";

    return "text-green-600";
  }
  return "text-blue-950";
};

export const TableValue = ({ item, type }: TableValueProps) => {
  const estabelecimento = item["Estabelecimento"];
  const category = useGetCategory(estabelecimento);

  const className = `w-full flex gap-1 items-center capitalize justify-center border-r-2 ${getColor(
    item,
    type,
  )} max-sm:px-2`;
  const value = item[type as keyof IData];

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
    return (
      <span className={className}>
        {category.name}
        <PiIcons iconName={category.icon} />{" "}
      </span>
    );
  }

  return <span className={className}>{value.toString()}</span>;
};
