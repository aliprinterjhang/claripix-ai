import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate token missing" }, { status: 500 });
    }

    // Using the most standard, highly accessible public version deployment for Real-ESRGAN
    const output = await replicate.run(
      "ai-forever/real-esrgan:f592f0fa6641ae15286a5ad3ae0c732ef35ade334ebecfe875e07661bbfe6466",
      {
        input: {
          image: image,
          face_enhance: true
        }
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix V5 Production Error:", error);
    return NextResponse.json(
      { error: `ClariPix V5 Final Validation Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
