import { ICategory, IData } from "@/types/data";
import { getCategory } from "../getCategory";

export function formatMercadoPagoCSV(csv: string, categories: ICategory[]) {
  const lines = csv.split("\n");
  const result: IData[] = [];
  const headers = lines[3].split(";");

  const formattedHeaders = headers.map((item) => {
    if (item === "RELEASE_DATE") return "Data";
    if (item === "TRANSACTION_TYPE") return "Estabelecimento";
    if (item === "REFERENCE_ID") return "Identificador";
    if (item === "TRANSACTION_NET_AMOUNT") return "Valor";

    return item;
  });

  for (var i = 4; i < lines.length; i++) {
    var obj = {} as IData;
    var currentLine = lines[i].split(";");

    for (var j = 0; j < formattedHeaders.length; j++) {
      if (currentLine[j]) {
        formatValues({
          json: obj,
          type: formattedHeaders[j],
          value: currentLine[j],
          categories,
        });
      }
    }

    obj.holder = "Gabriel Pereira Oliveira";
    obj.installment = "-";
    obj.type = "Mercado Pago";

    if (checkIfShouldAdd(obj)) {
      result.push(obj);
    }
  }

  // let totalRendimentos = 0;
  // let lastData = {} as IData;

  // const groupRendimentos = result.filter((item) => {
  //   if (item.description !== "Rendimentos ") {
  //     return true;
  //   }

  //   totalRendimentos += item.amount;
  //   lastData = {
  //     ...result[result.length - 2],
  //     id: new Date().getTime().toString(),
  //     description: "Rendimentos Totais",
  //     amount: totalRendimentos,
  //   };

  //   return false;
  // });

  // const resultWithRendimentos = groupRendimentos.with(-1, lastData);

  // return resultWithRendimentos;

  return result.filter((item) => item.description !== "Rendimentos ");
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
    let formattedValue = value;

    if (value.includes("Transferência Pix")) {
      formattedValue = value.replace("Transferência Pix", "PIX").trim();
    }

    if (value.includes("Pagamento de boleto")) {
      formattedValue = value.replace(/-.*$/, "").trim();
    }

    const category = getCategory(value, categories);

    json.categoryId = category.id;
    json.description = formattedValue;
    return;
  }

  if (type === "Valor" && value) {
    const valueNumber = Number(value.replace(".", "").replace(",", "."));
    json.amount = valueNumber;
    return;
  }

  if (type === "Data" && value) {
    const valueFormatted = value.replaceAll("-", "/");
    json.date = valueFormatted;

    const [day, month, year] = valueFormatted.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00`);

    json.timestamp = date.getTime();

    return;
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

const checkIfShouldAdd = (obj: IData) => {
  if (obj.description) {
    const value = obj.description as string;

    const lowerValue = value.toLowerCase();

    if (lowerValue.includes("gabriel pereira oliveira")) {
      return false;
    }

    return true;
  }

  return false;
};
