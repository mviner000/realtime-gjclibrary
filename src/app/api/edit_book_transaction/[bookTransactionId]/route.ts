import { env } from "@/env"; // Ensure this points to your environment variables
import { getToken } from "@/lib/token"; // Ensure this function retrieves the Bearer token correctly
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { bookTransactionId: string } }
): Promise<NextResponse> {
  const authToken = getToken(); // Retrieve the token on the server-side

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookTransactionId } = params;
  const DJANGO_API_URL = `${env.NEXT_PUBLIC_API_URL}/edit_book_transaction/${bookTransactionId}`;

  // Get the request body
  const body = await request.json();

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`, // Include token in the header
    },
    body: JSON.stringify(body), // Include the request body
  };

  try {
    const response = await fetch(DJANGO_API_URL, options);

    if (response.status === 404) {
      return NextResponse.json(
        { error: "Book Transaction not found" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to update Book Transaction:", error);

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
