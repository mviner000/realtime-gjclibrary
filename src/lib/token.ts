import { cookies } from "next/headers";

const TOKEN_AGE = 16200; // 4.5 hours in seconds
const TOKEN_NAME = "auth-admin-token";
const TOKEN_REFRESH_NAME = "auth-admin-refresh-token";

export function getToken(): string | undefined {
  const myAuthToken = cookies().get(TOKEN_NAME);
  return myAuthToken?.value;
}

export function getRefresToken(): string | undefined {
  const myAuthToken = cookies().get(TOKEN_REFRESH_NAME);
  return myAuthToken?.value;
}

export function setToken(authToken: string): void {
  cookies().set({
    name: TOKEN_NAME,
    value: authToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: TOKEN_AGE,
  });
}

export function refreshToken(authRefreshToken: string): void {
  cookies().set({
    name: TOKEN_REFRESH_NAME,
    value: authRefreshToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: TOKEN_AGE,
  });
}

export function deleteToken(): void {
  cookies().delete(TOKEN_REFRESH_NAME);
  cookies().delete(TOKEN_NAME);
}
