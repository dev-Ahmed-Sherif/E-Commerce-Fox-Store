import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/i18n/config";

const ACCESS_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE || "fox_access_token";
const REFRESH_COOKIE =
  process.env.REFRESH_TOKEN_COOKIE || "fox_refresh_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/profile")) {
    const sessionCookie = getSessionCookie(req, {
      cookiePrefix: "better-auth",
    });
    if (!sessionCookie) {
      const signIn = new URL("/sign-in", req.url);
      signIn.searchParams.set("from", pathname);
      return NextResponse.redirect(signIn);
    }
  }

  const response = NextResponse.next();

  const localeCookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (!isLocale(localeCookie)) {
    response.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const isDashboard =
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard/login");
  const hasAccess = Boolean(req.cookies.get(ACCESS_COOKIE)?.value);
  const hasRefresh = Boolean(req.cookies.get(REFRESH_COOKIE)?.value);

  if (isDashboard && !hasAccess && !hasRefresh) {
    const loginUrl = new URL("/dashboard/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard/login" && (hasAccess || hasRefresh)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
