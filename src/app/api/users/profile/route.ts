import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Forward the request to the Flask backend
    const response = await fetch(`${process.env.FLASK_API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Failed to update profile" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: data.user
    });
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
} 