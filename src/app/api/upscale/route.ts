import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const apiKey = process.env.DEEPAI_API_KEY || "quickstart-2ki98v329486t89213431";

    // Direct High-speed production upscaler node
    const response = await fetch("https://api.deepai.org/api/waifu2x", {
      method: "POST",
      headers: {
        "api-key": apiKey
      },
      body: new URLSearchParams({
        "image": image
      })
    });

    if (!response.ok) {
      throw new Error(`Upscaler Node returned status ${response.status}`);
    }

    const data = await response.json();
    
    // DeepAI returns a direct optimized image url in 'output_url'
    if (data && data.output_url) {
      return NextResponse.json({ output: data.output_url }, { status: 200 });
    }

    return NextResponse.json({ output: data }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix Engine Multi-Route Error:", error);
    return NextResponse.json(
      { error: `ClariPix Multi-Route Engine Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
