"use server";
import { env } from "@/env";
import { getRefresToken, getToken, refreshToken, setToken } from "@/lib/token";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
      return NextResponse.json(
        { error: responseData.message || "Invalid username or password" },
        { status: response.status }
      );
    }

    const { access, refresh } = responseData;
    
    // Set cookies with appropriate options
    const cookieStore = cookies();
    
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 15, // 15 minutes for access token
    });

    cookieStore.set("refresh_token", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
    });

    // Also set tokens in your existing storage method if needed
    setToken(access);
    refreshToken(refresh);

    // Create the response
    const responseBody = {
      ...responseData,
      message: "Login successful",
    };

    return NextResponse.json(responseBody, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
          ? env.NEXT_PUBLIC_API_URL 
          : 'http://localhost:3000',
      }
    });

  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
        ? env.NEXT_PUBLIC_API_URL 
        : 'http://localhost:3000',
    }
  });
}