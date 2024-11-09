import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { approveId: string } }
): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const DJANGO_BOOK_CARD_APPROVAL_URL = `${env.NEXT_PUBLIC_API_URL!}/create_book_card_approval_notification/${
    params.approveId
  }`;

  const body = await request.json();

  // Convert boolean to string for is_approved
  const updatedBody = {
    ...body,
    is_approved: body.is_approved ? "approved" : "disapproved",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updatedBody),
  };

  try {
    const response = await fetch(DJANGO_BOOK_CARD_APPROVAL_URL, options);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
