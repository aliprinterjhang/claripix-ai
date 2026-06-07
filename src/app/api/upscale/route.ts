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

    // Direct model slug invocation to prevent 422 permission errors
    const output = await replicate.run(
      "cjwbw/real-esrgan-a100:a100",
      {
        input: {
          image: image,
          upscale: 2,
          face_enhance: true
        }
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix V4 Production Error:", error);
    return NextResponse.json(
      { error: `ClariPix V4 Ultimate Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
