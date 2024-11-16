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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookTransactionId: string } }
): Promise<NextResponse> {
  const authToken = getToken();

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/book-transaction/${params.bookTransactionId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      if (!response.ok) {
        return NextResponse.json(
          { error: `HTTP error! status: ${response.status}` },
          { status: response.status }
        );
      }
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    // Handle JSON responses
    const result = await response.json();
    return NextResponse.json(result, {
      status: response.ok ? 200 : response.status,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
