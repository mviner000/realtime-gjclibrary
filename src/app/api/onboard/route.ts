import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_ONBOARD_URL = `${env.NEXT_PUBLIC_API_URL!}/complete-onboarding`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(DJANGO_API_ONBOARD_URL, options);

  const result = await response.json();
  const status = response.ok ? 200 : response.status;

  return NextResponse.json(result, { status });
}
