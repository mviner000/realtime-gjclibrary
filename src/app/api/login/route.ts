"use server";
import { env } from "@/env";
import { getRefresToken, getToken, refreshToken, setToken } from "@/lib/token";
import { NextResponse } from "next/server";

const DJANGO_API_LOGIN_URL = `${env.NEXT_PUBLIC_API_URL!}/token/pair/admin`;

export async function POST(request: Request) {
  const myAccessToken = getToken();
  const myRefreshToken = getRefresToken();

  try {
    const requestData = await request.json();
    const jsonData = JSON.stringify(requestData);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    };

    const response = await fetch(DJANGO_API_LOGIN_URL, requestOptions);
    const responseData = await response.json();

    if (!response.ok) {
      // Pass along the error message from the backend
      return NextResponse.json(
        { error: responseData.message || "Invalid username or password" },
        { status: response.status }
      );
    }
    const { access, refresh } = responseData;
    setToken(access);
    refreshToken(refresh);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // Handle errors in the request
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}