"use client";
import { useState, createContext, useCallback } from "react";

import { ICurrencyContext, IFormattedData } from "@/types/data";

export const CurrencyContext = createContext({} as ICurrencyContext);

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [value, setValue] = useState({
    in: "",
    out: "",
  });

  const calcValue = useCallback(
    (transactions: IFormattedData[], itemsToExclude: string[]) => {
      let inTotal = 0;
      let outTotal = 0;

      for (const item of transactions) {
        if (itemsToExclude.includes(item.id)) {
          continue;
        }

        const valorItem = Number(item.amount);
        if (valorItem > 0) {
          inTotal += valorItem;
        } else {
          outTotal += valorItem;
        }
      }

      setValue({
        in: inTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        out: outTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      });
    },
    [],
  );

  return (
    <CurrencyContext.Provider
      value={{
        calcValue,
        setValue,
        value,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
