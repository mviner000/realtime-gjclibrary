import { getAccessTokenFromServer } from "@/actions/token";
import { env } from "@/env";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // const hashedOldPassoword = await bcrypt.hash(requestData.old_password, 10);
    // requestData.old_password = hashedOldPassoword;

    // const hashedNewPassword = await bcrypt.hash(requestData.new_password, 10);
    // requestData.new_password = hashedNewPassword;

    // const hashedRepeatPassword = await bcrypt.hash(
    //   requestData.confirm_new_password,
    //   10
    // );
    // requestData.confirm_new_password = hashedRepeatPassword;

    const jsonData = JSON.stringify(requestData);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessTokenFromServer()}`,
      },
      body: jsonData,
    };

    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/change-password`,
      requestOptions
    );
    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.detail || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
