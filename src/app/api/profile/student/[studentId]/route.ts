// app/api/student_card/[studentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";

const DJANGO_API_STUDENT_CARD_BY_ID_URL = `${process.env
  .NEXT_PUBLIC_API_URL!}/student_card/{studentId}`;

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const authToken = getToken();
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    const fetchUrl = DJANGO_API_STUDENT_CARD_BY_ID_URL.replace(
      "{studentId}",
      params.studentId
    );

    const response = await fetch(fetchUrl, options);
    const result = await response.json();
    const status = response.ok ? 200 : response.status;

    return NextResponse.json(result, { status: status });
  } catch (error) {
    console.error("Error fetching student card:", error);
    return NextResponse.json(
      { error: "Internal server error - fetch student card details" },
      { status: 500 }
    );
  }
}
