import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response data
    const mockResponse = {
      success: true,
      message: "Images uploaded and processed successfully",
      faceGroups: [
        {
          id: "group-1",
          label: "Family Photos",
          details: "Photos of family members",
          imageUrls: [
            "/mock-images/family1.jpg",
            "/mock-images/family2.jpg",
            "/mock-images/family3.jpg"
          ]
        },
        {
          id: "group-2",
          label: "Friends",
          details: "Photos with friends",
          imageUrls: [
            "/mock-images/friends1.jpg",
            "/mock-images/friends2.jpg"
          ]
        },
        {
          id: "group-3",
          label: "Others",
          details: "Other photos",
          imageUrls: [
            "/mock-images/other1.jpg",
            "/mock-images/other2.jpg",
            "/mock-images/other3.jpg"
          ]
        }
      ],
      rejectedImages: [
        {
          filename: "no-face.jpg",
          reason: "No face detected in the image"
        },
        {
          filename: "too-many-faces.jpg",
          reason: "Multiple faces detected in the image"
        },
        {
          filename: "corrupted.jpg",
          reason: "Image file is corrupted or invalid"
        }
      ]
    };
    
    // Return the mock response
    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error) {
    console.error("Error in mock batch upload API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process images",
        faceGroups: [],
        rejectedImages: []
      },
      { status: 500 }
    );
  }
} 