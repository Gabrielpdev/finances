import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { ICategory } from "@/types/data";

const categoriesString = localStorage.getItem(
  `${LOCAL_STORAGE_KEY}_categories`
);
const categories = (
  categoriesString ? JSON.parse(categoriesString) : []
) as ICategory[];

export function formatMercadoPagoCSV(csv: string) {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[3].split(";");

  const formattedHeaders = headers.map((item) => {
    if (item === "RELEASE_DATE") return "Data";
    if (item === "TRANSACTION_TYPE") return "Estabelecimento";
    if (item === "REFERENCE_ID") return "Identificador";
    if (item === "TRANSACTION_NET_AMOUNT") return "Valor";

    return item;
  });

  for (var i = 4; i < lines.length; i++) {
    var obj = {} as any;
    var currentLine = lines[i].split(";");

    for (var j = 0; j < formattedHeaders.length; j++) {
      if (currentLine[j]) {
        formatValues({
          json: obj,
          type: formattedHeaders[j],
          value: currentLine[j],
        });
      }
    }

    obj["Tipo"] = "Mercado Pago";

    if (checkIfShouldAdd(obj)) {
      result.push(obj);
    }
  }

  return result;
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
    const fined = categories.find((category) =>
      category.list.some((item) => item === value)
    );

    json["Categoria"] = fined ? fined.name : "Outros";

    if (value.includes("Transferência")) {
      json[type] = value;

      return;
    }

    if (value.includes("Pagamento de boleto")) {
      json[type] = value.replace(/-.*$/, "").trim();
      return;
    }
  }

  if (type === "Valor" && value) {
    const valueNumber = Number(value.replace(".", "").replace(",", "."));
    json[type] = valueNumber;
    return;
  }

  if (type === "Data" && value) {
    const valueFormatted = value.replaceAll("-", "/");
    json[type] = valueFormatted;
    return;
  }

  json[type] = value;
};

const checkIfShouldAdd = (obj: any) => {
  if (obj["Estabelecimento"]) {
    const value = obj["Estabelecimento"] as string;

    const lowerValue = value.toLowerCase();

    if (lowerValue.includes("enviada gabriel pereira oliveira")) {
      return false;
    }

    return true;
  }

  return true;
};
