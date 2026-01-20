"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderDescription from "./header-cards";
import { useContext } from "react";
import { UserContext } from "@/providers/firebase";
import { PiSignOut } from "react-icons/pi";

export default function Header() {
  const { isUserAllowed, logout } = useContext(UserContext);

  return !isUserAllowed ? null : (
    <div className="bg-lime-900 h-48 w-full flex  justify-center pt-8">
      <div className="max-w-6xl w-full flex flex-col items-start justify-between max-sm:px-5">
        <div className="max-w-6xl w-full flex items-start justify-between max-sm:flex-col max-sm:gap-9 max-sm:items-center">
          <Link href="/home" className="flex">
            <Image src="/logo.svg" alt="logo" width={175} height={25} />
          </Link>

          <div className="flex text-white gap-8 ">
            <Link href="/home" className="flex">
              Listagem
            </Link>
            <Link href="/categorias" className="flex">
              Categorias
            </Link>
            <Link href="/importar" className="flex">
              Importar
            </Link>
          </div>

          <button
            onClick={logout}
            className="text-white text-2xl max-sm:absolute max-sm:top-6 max-sm:right-6"
          >
            <PiSignOut />
          </button>
        </div>

        <HeaderDescription />
      </div>
    </div>
  );
}
