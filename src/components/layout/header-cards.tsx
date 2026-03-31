"use client";
import { useContext } from "react";
import Card from "../elements/cards";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CurrencyContext } from "@/providers/currency";
import {
  PiArrowArcLeft,
  PiArrowBendDownLeft,
  PiArrowCircleLeft,
} from "react-icons/pi";

export default function HeaderDescription() {
  const path = usePathname();
  const params = useParams();
  const { back } = useRouter();

  const { value } = useContext(CurrencyContext);

  const saldo =
    Number(value.in.replace("R$ ", "").replace(".", "").replace(",", ".")) +
    Number(value.out.replace("R$ ", "").replace(".", "").replace(",", "."));

  if (path === "/home")
    return (
      <div className="flex max-w-6xl w-full gap-11 mt-16 overflow-x-auto min-h-max p-3 max-sm:mt-2 max-sm:gap-4">
        <Card title="Entradas" value={value.in} type="in" />
        <Card title="Saidas" value={value.out} type="out" />
        <Card
          title="Saldo"
          value={saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          type={saldo >= 0 ? "in" : "out"}
        />
      </div>
    );

  if (path === "/categorias")
    return (
      <h2 className="flex items-center w-full justify-between gap-2 text-4xl mb-5 text-white font-extrabold capitalize max-sm:text-2xl max-sm:mb-2">
        <div className="flex items-center gap-2">
          <button onClick={back}>
            <PiArrowCircleLeft />
          </button>
          {path.replace("/", "")}
        </div>
      </h2>
    );

  if (path.includes(params.categoryName as string))
    return (
      <h2 className="flex items-center justify-center gap-2 text-4xl mb-5 text-white font-extrabold capitalize max-sm:text-2xl">
        <button onClick={back}>
          <PiArrowCircleLeft />
        </button>
        {params.categoryName}
      </h2>
    );
}
