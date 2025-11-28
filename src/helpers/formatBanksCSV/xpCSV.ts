import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { ICategory } from "@/types/data";

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
  const categoriesString = localStorage.getItem(
    `${LOCAL_STORAGE_KEY}_categories`
  );
  const categories = (
    categoriesString ? JSON.parse(categoriesString) : []
  ) as ICategory[];

  if (type === "Estabelecimento" && value) {
    const fined = categories.find((category) =>
      category.list.some((item) => item === value)
    );

    json["Categoria"] = fined ? fined.name : "Outros";

    console.log(json["Parcela"]);
    console.log(json);

    json["Estabelecimento"] = value + json["Parcela"];
    if (json["Parcela"] !== "-") {
      // console.log({ json, value });

      return;
    }
  }

  if (type === "Valor" && value) {
    const valueNumber =
      Number(value.replace("R$ ", "").replace(".", "").replace(",", ".")) * -1;
    json[type] = valueNumber;
    return;
  }

  json[type] = value;
};
