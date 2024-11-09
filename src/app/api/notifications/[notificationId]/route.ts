import { env } from "@/env";
import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
): Promise<NextResponse> {
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = params;
  const DJANGO_API_MARK_AS_READ_NOTIF_URL = `${env.NEXT_PUBLIC_API_URL!}/admin/notifications/mark-as-read/${notificationId}`;

  const formData = await request.formData();

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  };

  try {
    const response = await fetch(DJANGO_API_MARK_AS_READ_NOTIF_URL, options);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
