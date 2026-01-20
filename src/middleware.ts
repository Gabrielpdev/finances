import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCAL_STORAGE_KEY } from "./constants/keys";

const PROTECTED_PATHS = ["/home", "/categorias", "/importar"];

export default function middleware(req: NextRequest) {
  const session = req.cookies.get(`${LOCAL_STORAGE_KEY}_session`);

  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((pathname === "/login" || pathname === "/not-allowed") && session) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}
