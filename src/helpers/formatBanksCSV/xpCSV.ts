import { ICategory, IData } from "@/types/data";
import { getCategory } from "../getCategory";
import { createHash } from "crypto";

export function formatXpCSV(csv: string, categories: ICategory[]) {
  const lines = csv.split("\r\n");

  let result = [];

  const headers = lines[0].split(";");
  const formattedHeaders = headers.map((item) => {
    if (item === "Descrição") return "Estabelecimento";
    return item;
  });

  for (var i = 1; i < lines.length; i++) {
    var obj = {} as IData;
    var currentLine = lines[i].split(";");

    if (!currentLine[0]) continue;

    for (var j = 0; j < formattedHeaders.length; j++) {
      obj.id = generateId(currentLine);

      formatValues({
        json: obj,
        type: formattedHeaders[j],
        value: currentLine[j],
        categories,
      });
    }
    if (!obj.description) continue;

    obj.type = "Xp";

    result.push(obj);
  }

  formatParcelaDate(result);

  addAllFutureInstallments(result);
  return result;
}

function generateId(currentLine: string[]) {
  const str = `${currentLine[0]}-${currentLine[1]}-${currentLine[2]}-${currentLine[3]}-${currentLine[4]}`;
  return createHash("md5").update(str).digest("hex");
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
    if (value === "Pagamentos Validos Normais") {
      return;
    }

    const category = getCategory(value, categories);

    json.categoryId = category.id;
    json.description = value;
  }

  if (type === "Valor" && value) {
    const valueNumber =
      Number(value.replace("R$ ", "").replace(".", "").replace(",", ".")) * -1;
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
};

const formatParcelaDate = (result: IData[]) => {
  const monthlyStats = result.reduce(
    (acc, item) => {
      if (!item.date || !item.amount) return acc;

      const key = item.date.substring(3, 5); // MM format

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
      if (!item.date || !item.amount) return acc;

      const key = item.date.substring(6, 10); // YYYY format

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

  const index = result.findIndex((item) => item.installment !== "-");

  if (index !== -1) {
    const [day, _month, _year] = result[index].date.split("/");

    result[index].date = `${day}/${highestMonth}/${highestYear}`;
  }

  return result;
};

const addAllFutureInstallments = (result: IData[]) => {
  const installments = result.filter((item) => item.installment !== "-");

  installments.forEach((item) => {
    const [day, month, year] = item.date.split("/").map(Number);
    const installmentNumber = Number(item.installment.split(" de ")[0]);
    const totalInstallments = Number(item.installment.split(" de ")[1]);

    if (installmentNumber >= totalInstallments) {
      return null;
    }

    new Array(totalInstallments - installmentNumber)
      .fill(null)
      .map((_, index) => {
        const nextMonth = month === 12 ? 1 : month + (index + 1);
        const nextYear = month === 12 ? year + (index + 1) : year;

        const nextDate = `${String(day).padStart(2, "0")}/${String(
          nextMonth,
        ).padStart(2, "0")}/${nextYear}`;
        const nextInstallment = `${installmentNumber + (index + 1)} de ${totalInstallments}`;

        const newItem = {
          ...item,
          id: generateId([
            nextDate,
            item.description,
            item.holder,
            item.amount.toString(),
            nextInstallment,
          ]),
          date: nextDate,
          installment: nextInstallment,
          timestamp: new Date(
            `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(
              day,
            ).padStart(2, "0")}T00:00:00`,
          ).getTime(),
        } as IData;

        result.push(newItem);
      });

    return item;
  });
};
