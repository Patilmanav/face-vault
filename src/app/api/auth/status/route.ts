import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.FLASK_API_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.detail || "Unauthorized" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (err) {
    console.error("Status error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
