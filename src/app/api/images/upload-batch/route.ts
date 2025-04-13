import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/images/upload-batch`, {
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
          message: data.message || "Batch upload failed",
          faceGroups: [],
          rejectedImages: []
        },
        { status: response.status }
      );
    }

    // Create a response with the batch upload results
    const nextResponse = NextResponse.json({
      success: true,
      message: "Batch upload completed successfully",
      faceGroups: data.faceGroups || [],
      rejectedImages: data.rejectedImages || []
    });

    // Copy cookies from Flask response to Next.js response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Batch upload API error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred",
        faceGroups: [],
        rejectedImages: []
      },
      { status: 500 }
    );
  }
} 