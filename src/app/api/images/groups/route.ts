import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the Flask API URL from environment variables
    const flaskApiUrl = process.env.FLASK_API_URL || "http://localhost:5000/api";
    
    // Forward the request to the Flask backend
    const response = await fetch(`${flaskApiUrl}/images/groups`, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        Cookie: request.headers.get("cookie") || "",
      },
    });

    // Get the response data
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Failed to fetch face groups",
          faceGroups: []
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Face groups fetched successfully",
      faceGroups: data.faceGroups || []
    });
  } catch (error) {
    console.error("Error in groups API route:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred",
        faceGroups: []
      },
      { status: 500 }
    );
  }
} 