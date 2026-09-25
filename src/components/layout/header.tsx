"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderDescription from "./header-cards";
import { useContext } from "react";
import { UserContext } from "@/providers/firebase";
import { PiSignOut } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
  const path = usePathname();

  const { logout } = useContext(UserContext);

  if (path === "/login" || path === "/not-allowed") {
    return null;
  }

  return (
    <header
      className={`w-full flex justify-center bg-sidebar pt-8 text-sidebar-foreground ${path === "/dashboard" ? "py-8" : "h-48"}`}
    >
      <div className="container mx-auto w-full flex flex-col items-start justify-between max-sm:px-5">
        <div className="w-full flex items-start justify-between max-sm:flex-col max-sm:gap-9 max-sm:items-center">
          <Link href="/dashboard" className="flex">
            <Image src="/logo.svg" alt="logo" width={175} height={25} />
          </Link>

          <nav className="flex gap-8 text-sm text-sidebar-foreground/80 max-md:gap-4 max-md:text-xs">
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
          </nav>

          <Button
            variant="invisible"
            onClick={logout}
            aria-label="Sair"
            className="text-2xl text-sidebar-foreground hover:bg-sidebar-accent max-sm:absolute max-sm:top-6 max-sm:right-6"
          >
            <PiSignOut />
          </Button>
        </div>

        <HeaderDescription />
      </div>
    </header>
  );
}
