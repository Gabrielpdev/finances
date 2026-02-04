import { ICategory } from "@/types/data";
import { getCategory } from "../getCategory";

export function formatXpCSV(csv: string, categories: ICategory[]) {
  const lines = csv.split("\r\n");

  let result = [];

  const headers = lines[0].split(";");
  const formattedHeaders = headers.map((item) => {
    if (item === "Descrição") return "Estabelecimento";
    return item;
  });

  for (var i = 1; i < lines.length; i++) {
    var obj = {} as any;
    var currentLine = lines[i].split(";");

    if (!currentLine[0]) continue;

    for (var j = 0; j < formattedHeaders.length; j++) {
      obj["Identificador"] =
        `${currentLine[0]}-${currentLine[1]}-${currentLine[2]}-${currentLine[3]}-${currentLine[4]}`;

      formatValues({
        json: obj,
        type: formattedHeaders[j],
        value: currentLine[j],
        categories,
      });
    }
    if (!obj["Estabelecimento"]) continue;

    obj["Tipo"] = "Xp";

    result.push(obj);
  }

  formatParcelaDate(result);

  return result;
}

const formatValues = ({
  json,
  type,
  value,
  categories,
}: {
  json: Record<string, any>;
  type: string;
  value: string;
  categories: ICategory[];
}) => {
  if (type === "Estabelecimento" && value) {
    if (value === "Pagamentos Validos Normais") {
      return;
    }

    const category = getCategory(value, categories);

    json["Categoria"] = category;
    json["Estabelecimento"] = value;
  }

  if (type === "Valor" && value) {
    const valueNumber =
      Number(value.replace("R$ ", "").replace(".", "").replace(",", ".")) * -1;
    json[type] = valueNumber;
    return;
  }

  json[type] = value;
};

const formatParcelaDate = (result: any[]) => {
  const monthlyStats = result.reduce(
    (acc, item) => {
      if (!item.Data || !item.Valor) return acc;

      const key = item.Data.substring(3, 5); // MM format

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key] += 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const yearlyStats = result.reduce(
    (acc, item) => {
      if (!item.Data || !item.Valor) return acc;

      const key = item.Data.substring(6, 10); // YYYY format

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key] += 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  let highestMonth = "";
  let highestValue = 0;

  Object.entries(monthlyStats).forEach((data) => {
    const [month, total] = data as [string, number];

    if (total > highestValue) {
      highestValue = total;
      highestMonth = month;
    }
  });

  let highestYear = "";
  let highestYearValue = 0;

  Object.entries(yearlyStats).forEach((data) => {
    const [year, total] = data as [string, number];

    if (total > highestYearValue) {
      highestYearValue = total;
      highestYear = year;
    }
  });

  const index = result.findIndex((item) => item.Parcela !== "-");

  if (index !== -1) {
    const [day, _month, _year] = result[index].Data.split("/");

    result[index]["Data"] = `${day}/${highestMonth}/${highestYear}`;
  }

  return result;
};
