import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkUserToken } from "./app/actions/checkUserToken";

const PROTECTED_PREFIXES = ["/home", "/dashboard", "/categorias", "/importar"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const result = await checkUserToken();

  const protectedPath = isProtectedPath(pathname);
  const isAuthPage = pathname === "/login" || pathname === "/not-allowed";

  if (!result.valid) {
    if (protectedPath) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  if (result.valid && isAuthPage) {
    return NextResponse.redirect(new URL("/home", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.js$|.*\\.svg$).*)",
  ],
};
