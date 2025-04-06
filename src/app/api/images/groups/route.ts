import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the Flask API URL from environment variables
    const flaskApiUrl = process.env.FLASK_API_URL || "http://localhost:5000/api";
    
    // Forward the request to the Flask backend
    const response = await fetch(`${flaskApiUrl}/images/groups`, {
      method: "GET",
      headers: {
        // Forward cookies for authentication
        Cookie: request.headers.get("cookie") || "",
      },
    });

    // Get the response data
    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in groups API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch face groups",
        faceGroups: []
      },
      { status: 500 }
    );
  }
} 