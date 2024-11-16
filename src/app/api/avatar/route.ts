import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_AVATAR_URL = `${env.NEXT_PUBLIC_API_URL!}/avatar_admin`;
const DEFAULT_AVATAR = "/images/def-avatar.svg";

interface AvatarResponse {
  avatar?: string | null;
  [key: string]: any;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authToken = getToken();

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(DJANGO_API_AVATAR_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    // First check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", await response.text());
      return NextResponse.json(
        {
          error: "Invalid response format",
          avatar: DEFAULT_AVATAR,
        },
        { status: 500 }
      );
    }

    let result: AvatarResponse;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse response",
          avatar: DEFAULT_AVATAR,
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: result.error || "Failed to fetch avatar",
          avatar: DEFAULT_AVATAR,
        },
        { status: response.status }
      );
    }

    const sanitizedResult = {
      ...result,
      avatar: result.avatar || DEFAULT_AVATAR,
    };

    return NextResponse.json(sanitizedResult, { status: 200 });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        avatar: DEFAULT_AVATAR,
      },
      { status: 500 }
    );
  }
}
