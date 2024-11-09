import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/attendanceV2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    const responsejson = await response.json();
    if (!response.ok) {
      throw new Error(responsejson);
    }

    return NextResponse.json(responsejson, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
