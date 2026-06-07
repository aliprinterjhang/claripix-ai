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

    // Using stable upscaler structure with error resilience
    const output = await replicate.run(
      "cjwbw/real-esrgan:d0102b5b46f2316bb01ced7a3295d5229b7361a7c2e99d3eec90ee693b4a243a",
      {
        input: {
          image: image,
          upscale: 2,
          face_enhance: true,
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix AI Production Error Log:", error);
    return NextResponse.json(
      { error: `ClariPix Backend Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
