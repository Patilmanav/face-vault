import {  NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response data
    const mockResponse = {
      success: true,
      message: "Face groups fetched successfully",
      faceGroups: [
        {
          id: "group-1",
          label: "Family Photos",
          details: "Photos of family members from vacation",
          imageUrls: [
            "/mock-images/family1.jpg",
            "/mock-images/family2.jpg",
            "/mock-images/family3.jpg",
            "/mock-images/family4.jpg",
            "/mock-images/family5.jpg"
          ]
        },
        {
          id: "group-2",
          label: "Friends",
          details: "Photos with friends from college",
          imageUrls: [
            "/mock-images/friends1.jpg",
            "/mock-images/friends2.jpg",
            "/mock-images/friends3.jpg"
          ]
        },
        {
          id: "group-3",
          label: "Work Colleagues",
          details: "Photos from office events",
          imageUrls: [
            "/mock-images/work1.jpg",
            "/mock-images/work2.jpg"
          ]
        },
        {
          id: "group-4",
          label: "Unnamed Group",
          details: "",
          imageUrls: [
            "/mock-images/other1.jpg",
            "/mock-images/other2.jpg",
            "/mock-images/other3.jpg",
            "/mock-images/other4.jpg"
          ]
        }
      ]
    };
    
    // Return the mock response
    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error) {
    console.error("Error in mock groups API route:", error);
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