"use server";

import { getToken, getRefresToken, deleteToken } from "@/lib/token";

export const getAccessTokenFromServer = async (): Promise<
  string | undefined
> => {
  const accessToken = getToken();
  return accessToken;
};

export const getRefreshTokenFromServer = async (): Promise<
  string | undefined
> => {
  const refreshToken = getRefresToken();
  return refreshToken;
};

export const deleteTokensFromServer = async (): Promise<void> => {
  try {
    deleteToken();
  } catch (error) {
    console.error("Failed to delete tokens:", error);
  }
};

export const isTokenSaved = async (): Promise<boolean> => {
  const accessToken = await getAccessTokenFromServer();
  return !!accessToken;
};
