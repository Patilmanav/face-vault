import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const response = await fetch(`${process.env.FLASK_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.detail || "Registration failed" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ success: false, message: "Register failed" }, { status: 500 });
  }
}
