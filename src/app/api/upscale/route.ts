import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Direct High-speed production upscaler via public processing node
    const response = await fetch("https://api.deepai.org/api/waifu2x", {
      method: "POST",
      headers: {
        "api-key": "quickstart-2ki98v329486t89213431" 
      },
      body: new URLSearchParams({
        "image": image
      })
    });

    if (!response.ok) {
      throw new Error(`Upscaler Node returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Fallback if the direct output url format maps differently
    const finalOutput = data.output_url || data.id || data;

    return NextResponse.json({ output: finalOutput }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix Engine Multi-Route Error:", error);
    return NextResponse.json(
      { error: `ClariPix Multi-Route Engine Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
