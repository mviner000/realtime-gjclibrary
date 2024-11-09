// nextjs/api/book-transaction/[bookTransactionId]/route.ts
import { env } from "@/env";
import { getToken } from "@/lib/token"; // Assuming this is usable in a server context
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { bookTransactionId: string } }
): Promise<NextResponse> {
  const authToken = getToken(); // Retrieve the token on the server-side
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookTransactionId } = params;
  const DJANGO_API_URL = `${env.NEXT_PUBLIC_API_URL}/book_transaction/${bookTransactionId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`, // Include token in the header
    },
  };

  try {
    const response = await fetch(DJANGO_API_URL, options);

    if (response.status === 404) {
      return NextResponse.json([], { status: 200 }); // Return empty array instead of 404
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Book Transaction details:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
