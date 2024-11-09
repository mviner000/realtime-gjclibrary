import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { quoteId: string } }
): Promise<NextResponse> {
  const authToken = getToken();

  if (!authToken) {
    return NextResponse.json({}, { status: 401 });
  }

  const { quoteId } = params;
  const { approval_status } = await request.json();

  const DJANGO_API_URL = `${env.NEXT_PUBLIC_API_URL}/admin_quotes/${quoteId}`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ approval_status }),
  };

  const response = await fetch(DJANGO_API_URL, options);

  const result = await response.json();
  let status = 200;
  if (!response.ok) {
    status = response.status;
  }

  return NextResponse.json({ ...result }, { status: status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { quoteId: string } }
): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quoteId } = params;
  const DJANGO_API_URL = `${env.NEXT_PUBLIC_API_URL}/admin_quotes/${quoteId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(DJANGO_API_URL, options);

    if (response.status === 404) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch quote details:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch quote details: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
