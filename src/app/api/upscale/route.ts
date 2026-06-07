import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token is missing in environment variables" },
        { status: 500 }
      );
    }

    // Using the highly stable official stability-ai Real-ESRGAN model deployment
    const output = await replicate.run(
      "stability-ai/esrgan:f621160de6e3b08cf0bf3ef74b1cb3b320bc69519ae8fa9f2a4729f6b9bc66cf",
      {
        input: {
          image: image,
          scale: 4,
          face_enhance: true,
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix AI Upscale Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during upscaling" },
      { status: 500 }
    );
  }
}
