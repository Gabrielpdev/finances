import { IData } from "@/types/data";
import { generateId } from "./formatBanksCSV/xpCSV";

export const addAllFutureInstallments = (result: IData[]) => {
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
        // Calcular o próximo mês e ano de forma precisa
        const totalMonthsFromStart = month + index + 1;
        const yearOffset = Math.floor((totalMonthsFromStart - 1) / 12);
        const nextMonth = ((totalMonthsFromStart - 1) % 12) + 1;
        const nextYear = year + yearOffset;

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

  return result;
};
