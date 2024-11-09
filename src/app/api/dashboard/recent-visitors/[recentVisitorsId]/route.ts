import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { recentVisitorsId: string } }
) {
  try {
    const { recentVisitorsId } = params;

    // Construct the API URL with the recentVisitorsId
    const apiUrl = new URL(
      `${env.NEXT_PUBLIC_API_URL}/recent-visitors/${recentVisitorsId}`
    );

    // Get additional query parameters
    const { searchParams } = new URL(request.url);
    const targetDate = searchParams.get("targetDate");

    // Add targetDate to API URL if provided
    if (targetDate) {
      apiUrl.searchParams.append("targetDate", targetDate);
    }

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(responseJson));
    }

    return NextResponse.json(responseJson, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent visitors:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
