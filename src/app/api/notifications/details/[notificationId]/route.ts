import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";

const DJANGO_API_NOTIFICATION_URL = `${process.env
  .NEXT_PUBLIC_API_URL!}/notification_details`;

export async function GET(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
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

    const fetchUrl = `${DJANGO_API_NOTIFICATION_URL}/${params.notificationId}`;

    const response = await fetch(fetchUrl, options);
    const result = await response.json();
    const status = response.ok ? 200 : response.status;

    return NextResponse.json(result, { status: status });
  } catch (error) {
    console.error("Error fetching notification details:", error);
    return NextResponse.json(
      { error: "Internal server error - fetch notification details" },
      { status: 500 }
    );
  }
}
