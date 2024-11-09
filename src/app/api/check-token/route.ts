import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();
  
  if (!authToken) {
    return NextResponse.json({}, { status: 401 });
  }

  return NextResponse.json({ token: authToken }, { status: 200 });
}
