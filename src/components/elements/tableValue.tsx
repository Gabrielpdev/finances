import PiIcons from "@/components/elements/icons";
import { IFormattedData } from "@/types/data";

interface TableValueProps {
  item: IFormattedData;
  type: string;
}

export const getColor = (item: IFormattedData, type: string) => {
  if (type === "Valor") {
    if (Number(item.amount) < 0) return "text-red-500";

    return "text-green-600";
  }
  return "text-blue-950";
};

export const TableValue = ({ item, type }: TableValueProps) => {
  const className = `w-full h-full flex gap-1 items-center capitalize justify-center border-r-2 ${getColor(
    item,
    type,
  )} max-sm:px-2 max-sm:justify-start max-sm:border-none`;

  if (type === "Estabelecimento") {
    const establishmentClassName = `w-full  h-full flex items-center capitalize border-r-2 text-blue-950 
    max-sm:px-2 max-sm:w-full max-sm:border-none max-sm:text-left max-sm:font-medium`;

    // Procurar pelo alias na lista da categoria
    const listItem = item.category.list.find((categoryItem) =>
      item.description
        .toLocaleLowerCase()
        .includes(categoryItem.key.toLocaleLowerCase()),
    );

    const displayText = listItem ? listItem.alias : item.description;

    if (item.installment) {
      const parcelaFormatted = `${displayText} ${
        item.installment !== "-" ? `(${item.installment})` : ""
      }`;

      return <span className={establishmentClassName}>{parcelaFormatted}</span>;
    }

    return <span className={establishmentClassName}>{displayText}</span>;
  }

  if (type === "Valor") {
    const currencyValue = Number(item.amount).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return (
      <span
        className={`${className} max-sm:border-l-2 max-sm:text-3xl max-sm:text-left`}
      >
        {currencyValue}
      </span>
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
    return (
      <span className={`${className} max-sm:justify-end `}>{item.date}</span>
    );
  }

  return <span className={className} />;
};
