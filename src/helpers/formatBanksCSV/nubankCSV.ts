import { ICategory } from "@/types/data";
import { getCategory } from "../getCategory";

export function formatNubankCSV(csv: string, categories: ICategory[]) {
  const lines = csv.split("\n");

  const result = [];

  const headers = lines[0].split(",");
  const formattedHeaders = headers.map((item) => {
    if (item === "Descrição") return "Estabelecimento";
    return item;
  });

  for (var i = 1; i < lines.length; i++) {
    var obj = {} as any;
    var currentLine = lines[i].split(",");

    for (var j = 0; j < formattedHeaders.length; j++) {
      formatValues({
        json: obj,
        type: formattedHeaders[j],
        value: currentLine[j],
        categories,
      });
    }
    obj["Tipo"] = "Nubank";

    result.push(obj);
  }
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
    if (value.includes("Transferência")) {
      json[type] = value
        .replace(/^((?:[^-]*-){1}[^-]*)-.*$/, "$1")
        .replace(/^[^-]*recebida[^-]*-/, "PIX de") // Replace "recebida" with "PIX de"
        .replace(/^[^-]*enviada[^-]*-/i, "PIX para") // Replace "enviada" with "PIX para"
        .trim()
        .toLocaleLowerCase();

      return;
    }

    if (value.includes("Pagamento de boleto")) {
      json[type] = value.replace(/-.*$/, "").trim();
      return;
    }

    const category = getCategory(value, categories);

    json["Categoria"] = category;
  }

  if (type === "Valor" && value) {
    const valueNumber = Number(value.replace("R$ ", ""));
    json[type] = valueNumber;
    return;
  }

  json[type] = value;
};
