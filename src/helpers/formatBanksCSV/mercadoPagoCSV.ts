export function formatMercadoPagoCSV(csv: string) {
  const lines = csv.split("\n");
  const result: any[] = [];
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

  let totalRendimentos = 0;
  let lastData = {};

  const groupRendimentos = result.filter((item: any) => {
    if (item["Estabelecimento"] !== "Rendimentos ") {
      return true;
    }

    totalRendimentos += item["Valor"];
    lastData = {
      ...result[result.length - 2],
      Estabelecimento: "Rendimentos Totais",
      Valor: totalRendimentos,
    };

    return false;
  });

  const resultWithRendimentos = groupRendimentos.with(-1, lastData);

  return resultWithRendimentos;
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
    let formattedValue = value;

    if (value.includes("Transferência Pix")) {
      formattedValue = value.replace("Transferência Pix", "PIX").trim();
    }

    if (value.includes("Pagamento de boleto")) {
      formattedValue = value.replace(/-.*$/, "").trim();
    }

    json["Categoria"] = "";
    json[type] = formattedValue;
    return;
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
