// pages/api/picture/delete/[imageId].ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";

const DJANGO_API_DELETE_PICTURE_URL = `${process.env
  .NEXT_PUBLIC_API_URL!}/account/pictures/{imageId}`;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const imageId = params.imageId;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const authToken = getToken();
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await fetch(
      DJANGO_API_DELETE_PICTURE_URL.replace("{imageId}", imageId),
      options
    );
    const result = await response.json();
    const status = response.ok ? 200 : response.status;

    return NextResponse.json(result, { status: status });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error - delete " },
      { status: 500 }
    );
  }
}
