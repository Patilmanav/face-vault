import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const formData = new URLSearchParams();
    formData.append("username", email);  // FastAPI expects 'username'
    formData.append("password", password); // FastAPI expects 'password'

    const response = await fetch(`${process.env.FLASK_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.detail }, { status: response.status });
    }

    // Store token in cookie (optional)
    const nextResponse = NextResponse.json({
      success: true,
      token: data.access_token,
      token_type: data.token_type,
    });

    nextResponse.cookies.set("access_token", data.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    return nextResponse;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 });
  }
}
