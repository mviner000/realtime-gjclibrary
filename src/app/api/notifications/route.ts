import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_NOTIFICATION_URL = `${env.NEXT_PUBLIC_API_URL!}/admin/notifications`;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();

  if (!authToken) {
    return NextResponse.json({}, { status: 401 });
  }

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  const response = await fetch(DJANGO_API_NOTIFICATION_URL, options);

  const result = await response.json();
  let status = 200;
  if (!response.ok) {
    status = 401;
    // return NextResponse.json({...result}, { status: 401 });
  }

  return NextResponse.json({ ...result }, { status: status });
}
