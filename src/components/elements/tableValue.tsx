import PiIcons from "@/components/elements/icons";
import { IData, IFormattedData } from "@/types/data";

interface TableValueProps {
  item: IFormattedData;
  type: string;
  shouldWarnXpItem?: boolean;
}

export const getColor = (item: IFormattedData, type: string) => {
  if (type === "Valor") {
    if (Number(item.amount) < 0) return "text-red-500";

    return "text-green-600";
  }
  return "text-blue-950";
};

export const TableValue = ({ item, type }: TableValueProps) => {
  const className = `w-full flex gap-1 items-center capitalize justify-center border-r-2 ${getColor(
    item,
    type,
  )} max-sm:px-2`;

  if (type === "Estabelecimento") {
    const establishmentClassName = `w-full flex items-center capitalize border-r-2 text-blue-950 max-sm:px-2 max-sm:w-full max-sm:justify-center`;

    if (item.installment) {
      const parcelaFormatted = `${item.description} ${
        item.installment !== "-" ? `(${item.installment})` : ""
      }`;

      return <span className={establishmentClassName}>{parcelaFormatted}</span>;
    }

    return <span className={establishmentClassName}>{item.description}</span>;
  }

  if (type === "Valor") {
    const currencyValue = Number(item.amount).toLocaleString("pt-BR", {
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
        {item.category.name} <PiIcons iconName={item.category.icon} />{" "}
      </span>
    );
  }

  if (type === "Data") {
    return <span className={className}>{item.date}</span>;
  }

  return <span className={className} />;
};
