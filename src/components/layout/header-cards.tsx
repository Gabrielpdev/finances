"use client";
import { useContext } from "react";
import Card from "../elements/cards";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CurrencyContext } from "@/providers/currency";
import { PiFloppyDisk } from "react-icons/pi";
import { toast } from "react-toastify";
import { createCategories } from "@/app/actions/categories/create";
import { LOCAL_STORAGE_KEY } from "@/constants/keys";
import { CategoriesContext } from "@/providers/categories";

export default function HeaderDescription() {
  const path = usePathname();
  const params = useParams();
  const { back, push } = useRouter();

  const { value } = useContext(CurrencyContext);
  const { categories } = useContext(CategoriesContext);

  async function handleSaveCategory() {
    for (const category of categories) {
      await createCategories(category);
    }
    toast.success("Categorias salvas com sucesso!");
    push("/home");
  }

  if (path === "/home")
    return (
      <div className="flex max-w-6xl w-full gap-11 mt-16 overflow-x-auto min-h-max p-3 max-sm:mt-2 max-sm:gap-4">
        <Card title="Entradas" value={value.in} type="in" />
        <Card title="Saidas" value={value.out} type="out" />
        <Card
          title="Saldo"
          value={(
            Number(
              value.in.replace("R$ ", "").replace(".", "").replace(",", "."),
            ) +
            Number(
              value.out.replace("R$ ", "").replace(".", "").replace(",", "."),
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
      <h2 className="flex items-center w-full justify-between gap-2 text-4xl mb-5 text-white font-extrabold capitalize max-sm:text-2xl max-sm:mb-2">
        <div className="flex items-center gap-2">
          <button onClick={back}>{`<`}</button>
          {path.replace("/", "")}
        </div>

        <button
          className="flex items-center gap-1 font-normal text-2xl "
          onClick={handleSaveCategory}
        >
          Salvar
          <PiFloppyDisk />
        </button>
      </h2>
    );

  if (path.includes(params.categoryName as string))
    return (
      <h2 className="flex items-center justify-center gap-2 text-4xl mb-5 text-white font-extrabold capitalize max-sm:text-2xl">
        <button onClick={back}>{`<`}</button>
        {params.categoryName}
      </h2>
    );
}
