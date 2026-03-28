import { ICategory, IData } from "@/types/data";
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
    var obj = {} as IData;
    var currentLine = lines[i].split(",");

    for (var j = 0; j < formattedHeaders.length; j++) {
      formatValues({
        json: obj,
        type: formattedHeaders[j],
        value: currentLine[j],
        categories,
      });
    }
    obj.type = "Nubank";

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
  json: IData;
  type: string;
  value: string;
  categories: ICategory[];
}) => {
  if (type === "Estabelecimento" && value) {
    if (value.includes("Transferência")) {
      json.description = value
        .replace(/^((?:[^-]*-){1}[^-]*)-.*$/, "$1")
        .replace(/^[^-]*recebida[^-]*-/, "PIX de") // Replace "recebida" with "PIX de"
        .replace(/^[^-]*enviada[^-]*-/i, "PIX para") // Replace "enviada" with "PIX para"
        .trim()
        .toLocaleLowerCase();

      return;
    }

    if (value.includes("Pagamento de boleto")) {
      json.description = value.replace(/-.*$/, "").trim();
      return;
    }

    const category = getCategory(value, categories);

    json.categoryId = category.id;
  }

  if (type === "Valor" && value) {
    const valueNumber = Number(value.replace("R$ ", ""));
    json.amount = valueNumber;
    return;
  }

  if (type === "Data" && value) {
    json.date = value;

    const [day, month, year] = value.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00`);

    json.timestamp = date.getTime();
  }

  if (type === "Parcela" && value) {
    json.installment = value;
  }

  if (type === "Portador" && value) {
    json.holder = value;
  }

  if (type === "Identificador" && value) {
    json.id = value;
  }
};
