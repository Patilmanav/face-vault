import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/auth/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Forward cookies from the client to the Flask backend
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Authentication check failed" },
        { status: response.status }
      );
    }

    // Create a response with the user data
    const nextResponse = NextResponse.json(data);

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Auth status API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 