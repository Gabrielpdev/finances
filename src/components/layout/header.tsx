"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderDescription from "./header-cards";
import { useContext } from "react";
import { UserContext } from "@/providers/firebase";
import { PiSignOut } from "react-icons/pi";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  const { isUserAllowed, logout } = useContext(UserContext);

  return !isUserAllowed ? null : (
    <div
      className={`bg-lime-900 w-full flex justify-center pt-8 ${path === "/dashboard" ? "py-8" : "h-48"}`}
    >
      <div className="max-w-6xl w-full flex flex-col items-start justify-between max-sm:px-5">
        <div className="max-w-6xl w-full flex items-start justify-between max-sm:flex-col max-sm:gap-9 max-sm:items-center">
          <Link href="/dashboard" className="flex">
            <Image src="/logo.svg" alt="logo" width={175} height={25} />
          </Link>

          <div className="flex text-white gap-8 max-md:text-sm ">
            <Link href="/dashboard" className="flex">
              Dashboard
            </Link>
            <Link href="/home" className="flex">
              Transações
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
