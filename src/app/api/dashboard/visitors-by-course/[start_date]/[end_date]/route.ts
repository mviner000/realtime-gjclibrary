import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";

export async function GET(
  request: NextRequest,
  { params }: { params: { start_date: string; end_date: string } }
) {
  const { start_date, end_date } = params;

  try {
    const token = await getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/visitors-by-course/${start_date}/${end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch data");
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch visitor counts" },
      { status: 500 }
    );
  }
}
