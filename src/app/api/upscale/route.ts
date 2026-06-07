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

    // Direct model deployment call without rigid version hashes to bypass 422 restrictions
    const output = await replicate.run(
      "lucataco/real-esrgan",
      {
        input: {
          image: image,
          scale: 2,
          face_enhance: true
        }
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix Engine Final Error:", error);
    return NextResponse.json(
      { error: `ClariPix Final Engine Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
