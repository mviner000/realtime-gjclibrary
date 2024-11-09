import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { bookRecordsId: string } }
): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookRecordsId } = params;
  const DJANGO_API_URL = `${env.NEXT_PUBLIC_API_URL}/book_records/${bookRecordsId}`;

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
      return NextResponse.json(
        {
          message: `No book records found for account school ID ${bookRecordsId}`,
        },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return NextResponse.json(
        { message: "No book records available." },
        { status: 200 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Book Records:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
