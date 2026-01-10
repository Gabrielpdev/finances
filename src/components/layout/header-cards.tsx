"use client";
import { useContext } from "react";
import Card from "../elements/cards";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CurrencyContext } from "@/providers/currency";
import { PiFloppyDisk } from "react-icons/pi";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { getCategory } from "@/helpers/getCategory";
import { IData } from "@/types/data";
import { toast } from "react-toastify";

export default function HeaderDescription() {
  const path = usePathname();
  const params = useParams();
  const { back, push } = useRouter();

  const { value } = useContext(CurrencyContext);

  function handleSaveCategory() {
    const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const data = dataString ? (JSON.parse(dataString) as IData[]) : [];

    const newData = data.map((item) => {
      const value = item["Estabelecimento"];
      const category = getCategory(value);

      return {
        ...item,
        Categoria: category,
      };
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    toast.success("Categorias salvas com sucesso!");
    push("/");
  }

  if (path === "/")
    return (
      <div className="flex max-w-6xl w-full gap-11 mt-16 overflow-x-auto min-h-max p-3 max-sm:mt-2 max-sm:gap-4">
        <Card title="Entradas" value={value.in} type="in" />
        <Card title="Saidas" value={value.out} type="out" />
        <Card
          title="Saldo"
          value={(
            Number(
              value.in.replace("R$ ", "").replace(".", "").replace(",", ".")
            ) +
            Number(
              value.out.replace("R$ ", "").replace(".", "").replace(",", ".")
            )
          ).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          type="in"
        />
      </div>
    );

  if (path === "/categorias")
    return (
      <h2 className="flex items-center w-full justify-center gap-2 text-4xl mb-5 text-white font-extrabold capitalize">
        <button onClick={back}>{`<`}</button>
        {path.replace("/", "")}
        <button
          className="flex items-center gap-2 font-normal text-2xl ml-auto"
          onClick={handleSaveCategory}
        >
          Salvar
          <PiFloppyDisk />
        </button>
      </h2>
    );

  if (path.includes(params.categoryName as string))
    return (
      <h2 className="flex items-center justify-center gap-2 text-4xl mb-5 text-white font-extrabold capitalize">
        <button onClick={back}>{`<`}</button>
        {params.categoryName}
      </h2>
    );
}
