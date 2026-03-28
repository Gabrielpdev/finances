import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCAL_STORAGE_KEY } from "./constants/keys";

const PROTECTED_PREFIXES = ["/home", "/dashboard", "/categorias", "/importar"];
const AUTH_COOKIE_NAME = `${LOCAL_STORAGE_KEY}_session`;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const session = req.cookies.get(AUTH_COOKIE_NAME);

  const hasSession = Boolean(session?.value);
  const protectedPath = isProtectedPath(pathname);
  const isAuthPage = pathname === "/login" || pathname === "/not-allowed";

  if (protectedPath && !hasSession) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (hasSession && (isAuthPage || pathname === "/")) {
    return NextResponse.redirect(new URL("/home", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.js$|.*\\.svg$).*)",
  ],
};
