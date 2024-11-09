import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";

export async function GET(
  request: NextRequest,
  { params }: { params: { target_date: string } }
) {
  const { target_date } = params;
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "20";
  const search = searchParams.get("search") || ""; // Extract search query

  // console.log(
  //   `Received request for target_date: ${target_date}, page: ${page}, size: ${size}, search: ${search}`
  // );

  try {
    const token = await getToken();
    // console.log(
    //   "Retrieved token:",
    //   token ? "Token exists" : "Token is null or empty"
    // );

    const apiUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/all-visitors/${target_date}`
    );
    apiUrl.searchParams.append("page", page);
    apiUrl.searchParams.append("size", size);
    if (search) apiUrl.searchParams.append("search", search); // Append search query

    // console.log("Sending request to Django API:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // console.error(
      //   "Django API response not OK:",
      //   response.status,
      //   response.statusText
      // );
      throw new Error(`Django API responded with status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Received data from Django API:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
