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

    // Using the official, highly stable xinntao/realesrgan model version
    const output = await replicate.run(
      "xinntao/realesrgan:1b9734c1929c99061aa32efad560e91f66c53bc47ef20dae59fa255b87b275e6",
      {
        input: {
          image: image,
          scale: 4, // Upscale factor (4x premium quality)
          face_enhance: true, // Enhances faces automatically if present
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
