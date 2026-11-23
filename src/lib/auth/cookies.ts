import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "./tokens";

const isProd = process.env.NODE_ENV === "production";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = await cookies();

  jar.set(TOKEN_COOKIE.access, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  jar.set(TOKEN_COOKIE.refresh, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE.access);
  jar.delete(TOKEN_COOKIE.refresh);
}

export async function getAccessTokenFromCookies() {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE.access)?.value;
}

export async function getRefreshTokenFromCookies() {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE.refresh)?.value;
}
