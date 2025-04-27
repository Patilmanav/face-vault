import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
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
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/images/search`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    // console.log(response.json());
    const data = await response.json();
    console.log(data); // ✅ Now it's safe

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.detail || "Image search failed" 
        },
        { status: response.status }
      );
    }

    // Create a response with the search results
    const nextResponse = NextResponse.json({
      success: true,
      message: "Search completed successfully",
      results: data.matches || []
    });

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Image search API error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
} 