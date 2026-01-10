import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { ICategory } from "@/types/data";
import { getCategory } from "../getCategory";

export function formatXpCSV(csv: string) {
  const lines = csv.split("\r\n");

  const result = [];

  const headers = lines[0].split(";");
  const formattedHeaders = headers.map((item) => {
    if (item === "Descrição") return "Estabelecimento";
    return item;
  });

  for (var i = 1; i < lines.length; i++) {
    var obj = {} as any;
    var currentLine = lines[i].split(";");

    for (var j = 0; j < formattedHeaders.length; j++) {
      obj[
        "Identificador"
      ] = `${currentLine[0]}-${currentLine[1]}-${currentLine[2]}-${currentLine[3]}-${currentLine[4]}`;

      formatValues({
        json: obj,
        type: formattedHeaders[j],
        value: currentLine[j],
      });
    }
    obj["Tipo"] = "Xp";

    result.push(obj);
  }

  // Analyze which month has the highest data
  const monthlyStats = result.reduce((acc, item) => {
    if (!item.Data || !item.Valor) return acc;

    const monthKey = item.Data.substring(3, 5); // MM format

    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }

    acc[monthKey] += 1;

    return acc;
  }, {} as Record<string, number>);

  // Find month with highest total value
  let highestMonth = "";
  let highestValue = 0;

  Object.entries(monthlyStats).forEach((data) => {
    const [month, total] = data as [string, number];

    if (total > highestValue) {
      highestValue = total;
      highestMonth = month;
    }
  });

  const formattedResult = result
    .filter((item) => item.Estabelecimento)
    .map((item) => {
      if (item.Parcela !== "-") {
        const [day, _month, year] = item.Data.split("/");

        return {
          ...item,
          Data: `${day}/${highestMonth}/${year}`,
        };
      }

      return item;
    });

  return formattedResult;
}

const formatValues = ({
  json,
  type,
  value,
}: {
  json: Record<string, any>;
  type: string;
  value: string;
}) => {
  if (type === "Estabelecimento" && value) {
    if (value === "Pagamentos Validos Normais") {
      return;
    }

    const category = getCategory(value);

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
