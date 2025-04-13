import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Login failed" 
        },
        { status: response.status }
      );
    }

    // Create a response with the user data
    const nextResponse = NextResponse.json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: data.user
    });

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
} 