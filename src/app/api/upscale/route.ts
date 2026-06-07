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

    // Official production-ready stable model call
    const output = await replicate.run(
      "stability-ai/sdxl-uploader:a01b0b797fc61f621d8b67f13b6f9f3c7e7b6495d5229b7361a7c2e99d3eec90",
      {
        input: {
          image: image,
          task: "real-esrgan-x2"
        }
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix V3 Final Error:", error);
    return NextResponse.json(
      { error: `ClariPix V3 Final Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
