import { SignJWT, jwtVerify } from "jose";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  type: "refresh";
  jti: string;
};

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

function getSecret(name: string, fallback: string) {
  const value = process.env[name] || fallback;
  return new TextEncoder().encode(value);
}

function accessSecret() {
  return getSecret(
    "ACCESS_TOKEN_SECRET",
    "fox-dev-access-secret-change-me-32chars"
  );
}

function refreshSecret() {
  return getSecret(
    "REFRESH_TOKEN_SECRET",
    "fox-dev-refresh-secret-change-me-32chars"
  );
}

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "type">
) {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(accessSecret());
}

export async function signRefreshToken(userId: string, jti: string) {
  return new SignJWT({ sub: userId, type: "refresh", jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(refreshSecret());
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret());
  if (payload.type !== "access" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token");
  }
  return payload as unknown as AccessTokenPayload & {
    exp: number;
    iat: number;
  };
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshSecret());
  if (
    payload.type !== "refresh" ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }
  return payload as unknown as RefreshTokenPayload & {
    exp: number;
    iat: number;
  };
}

export const TOKEN_COOKIE = {
  access: process.env.ACCESS_TOKEN_COOKIE || "fox_access_token",
  refresh: process.env.REFRESH_TOKEN_COOKIE || "fox_refresh_token",
} as const;
