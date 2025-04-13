import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/images/search`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Image search failed" 
        },
        { status: response.status }
      );
    }

    // Create a response with the search results
    const nextResponse = NextResponse.json({
      success: true,
      message: "Search completed successfully",
      results: data.results || []
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