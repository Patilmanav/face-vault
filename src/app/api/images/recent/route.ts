import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication token not found",
          faceGroups: [],
          rejectedImages: [],
        },
        { status: 401 }
      );
    }
    const response = await fetch(`${process.env.FLASK_API_URL}/images/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.detail || "Failed to fetch recent images",
          images: []
        },
        { status: response.status }
      );
    }

    // Create a response with the recent images data
    const nextResponse = NextResponse.json({
      success: true,
      message: "Recent images fetched successfully",
      images: data.groups || []
    });

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Recent images API error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred",
        images: []
      },
      { status: 500 }
    );
  }
} 