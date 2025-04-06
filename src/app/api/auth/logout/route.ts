import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Forward cookies from the client to the Flask backend
      credentials: "include",
    });

    // Create a response
    const nextResponse = NextResponse.json({ success: true });

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 