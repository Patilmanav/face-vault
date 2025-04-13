// /app/api/auth/status/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/v1/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader || "", // forward token
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.detail || "Authentication check failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Auth status API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}