import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/images/upload`, {
      method: "POST",
      body: formData,
      // Forward cookies from the client to the Flask backend
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Image upload failed" },
        { status: response.status }
      );
    }

    // Create a response with the image data
    const nextResponse = NextResponse.json(data);

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Image upload API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 