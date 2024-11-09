import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_RETRIEVE_CROPPED_IMAGES_URL = `${env.NEXT_PUBLIC_API_URL!}/account/cropped_image`;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authToken = await getToken();

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const options = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    };

    const response = await fetch(DJANGO_API_RETRIEVE_CROPPED_IMAGES_URL, options);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to retrieve images' }, { status: response.status });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching cropped images:", error);
    return NextResponse.json({ error: 'An error occurred while fetching cropped images' }, { status: 500 });
  }
}
