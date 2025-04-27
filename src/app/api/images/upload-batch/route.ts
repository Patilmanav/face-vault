import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    const response = await fetch(`${process.env.FLASK_API_URL}/images/upload-batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const text = await response.text();
    console.log('\n\n\n****************************', text, '\n****************************\n\n');
    const data = JSON.parse(text);
    
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.detail || "Batch upload failed",
          faceGroups: [],
          rejectedImages: [],
        },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      message: "Batch upload completed successfully",
      faceGroups: data.faceGroups || [],
      rejectedImages: data.rejectedImages || [],
    });

    // 🍪 Optionally copy any Set-Cookie headers from Flask (if any)
    const setCookieHeaders = response.headers.getSetCookie?.();
    if (setCookieHeaders?.length) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Batch upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        faceGroups: [],
        rejectedImages: [],
      },
      { status: 500 }
    );
  }
}
