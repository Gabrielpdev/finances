import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { LOCAL_STORAGE_KEY } from "./constants/keys";
import { checkUserToken } from "./app/actions/checkUserToken";

const PROTECTED_PREFIXES = ["/home", "/dashboard", "/categorias", "/importar"];
// const AUTH_COOKIE_NAME = `${LOCAL_STORAGE_KEY}_session`;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  // const session = req.cookies.get(AUTH_COOKIE_NAME);

  // const hasSession = Boolean(session?.value);
  const result = await checkUserToken();

  const protectedPath = isProtectedPath(pathname);
  const isAuthPage =
    pathname === "/login" || pathname === "/not-allowed" || pathname === "/";

  if (protectedPath && !result.valid) {
    return NextResponse.redirect(new URL("/login", origin));
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
