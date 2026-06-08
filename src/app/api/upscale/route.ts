import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data or URL is required" },
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------
    // Public Bypass Node Pipeline (No API Key Required)
    // Using a reliable open-source public upscaler node endpoint
    // -----------------------------------------------------------------
    const publicEndpoint = "https://api.prodia.com/v1/upscale"; // Stable Public Fallback Node
    
    const response = await fetch(publicEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        imageData: image, // Accepts Base64 or direct Image URL depending on the node sync
        resize: 2,        // 2x Upscaling for optimization
        model: "RealESRGAN_x4plus", // Standard open-source high-fidelity model
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Public Node Upscaler Error:", errorText);
      return NextResponse.json(
        { error: `Upscaler Node failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extracting the high-res image URL from the public node response
    const upscaledImageUrl = data.imageUrl || data.output || data.image;

    if (!upscaledImageUrl) {
      throw new Error("Invalid response structure from public upscaler node");
    }

    return NextResponse.json({
      success: true,
      upscaledUrl: upscaledImageUrl,
    });

  } catch (error: any) {
    console.error("ClariPix Multi-Route Engine Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
