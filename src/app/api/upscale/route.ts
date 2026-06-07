import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Direct super-fast fallback upscaler API using official Hugging Face architecture
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gandhi9k/RealESRGAN_x4plus",
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: image }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API returned status ${response.status}`);
    }

    // Convert the raw image blob response directly to base64 string for your frontend
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

    return NextResponse.json({ output: base64Image }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix HF Production Error:", error);
    return NextResponse.json(
      { error: `ClariPix Free Pipeline Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
