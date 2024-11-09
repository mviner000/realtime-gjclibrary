import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_CREATE_BOOK_TRANSACTION_URL = `${env.NEXT_PUBLIC_API_URL!}/book_transaction`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(DJANGO_API_CREATE_BOOK_TRANSACTION_URL, options);

  const result = await response.json();
  const status = response.ok ? 200 : response.status;

  return NextResponse.json(result, { status });
}
