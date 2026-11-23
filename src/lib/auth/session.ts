import { randomUUID } from "crypto";

import prismadb from "@/lib/prismadb";
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "./cookies";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./tokens";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

const refreshStore = new Map<string, { userId: string; expiresAt: number }>();

export function storeRefreshToken(jti: string, userId: string, days = 7) {
  refreshStore.set(jti, {
    userId,
    expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
  });
}

export function revokeRefreshToken(jti: string) {
  refreshStore.delete(jti);
}

export function isRefreshTokenValid(jti: string, userId: string) {
  const entry = refreshStore.get(jti);
  if (!entry) return false;
  if (entry.userId !== userId) return false;
  if (entry.expiresAt < Date.now()) {
    refreshStore.delete(jti);
    return false;
  }
  return true;
}

export async function issueTokens(user: SessionUser) {
  const jti = randomUUID();
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
    signRefreshToken(user.id, jti),
  ]);

  storeRefreshToken(jti, user.id);
  await setAuthCookies(accessToken, refreshToken);

  return { accessToken, refreshToken, user };
}

export async function getSession(): Promise<SessionUser | null> {
  const access = await getAccessTokenFromCookies();
  if (access) {
    try {
      const payload = await verifyAccessToken(access);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    } catch {
      // fall through to refresh
    }
  }

  return refreshSession();
}

export async function refreshSession(): Promise<SessionUser | null> {
  const refresh = await getRefreshTokenFromCookies();
  if (!refresh) return null;

  try {
    const payload = await verifyRefreshToken(refresh);
    if (!isRefreshTokenValid(payload.jti, payload.sub)) {
      await clearAuthCookies();
      return null;
    }

    revokeRefreshToken(payload.jti);

    let user: SessionUser | null = null;
    try {
      const dbUser = await prismadb.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role?.name ?? "CUSTOMER",
        };
      }
    } catch {
      // DB unavailable — use demo admin from token subject
    }

    if (!user && payload.sub === "demo-admin") {
      user = {
        id: "demo-admin",
        email: "admin@foxstore.eg",
        name: "Fox Admin",
        role: "ADMIN",
      };
    }

    if (!user) {
      await clearAuthCookies();
      return null;
    }

    await issueTokens(user);
    return user;
  } catch {
    await clearAuthCookies();
    return null;
  }
}

export function isAdminRole(role: string) {
  return ["SUPER", "ADMIN", "SUBADMIN"].includes(role);
}
