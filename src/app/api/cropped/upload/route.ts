import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_UPLOAD_CROPPED_IMAGE_URL = `${env.NEXT_PUBLIC_API_URL!}/account/upload_cropped_image_url`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cropped_image_url } = await request.json();

  if (!cropped_image_url) {
    return NextResponse.json({ error: "Field required" }, { status: 400 });
  }

  const options = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cropped_image_url }),
  };

  const response = await fetch(DJANGO_API_UPLOAD_CROPPED_IMAGE_URL, options);

  const result = await response.json();
  const status = response.ok ? 200 : response.status;

  return NextResponse.json(result, { status });
}
