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

    // High-availability public model verified for free tier accounts
    const output = await replicate.run(
      "lucataco/real-esrgan:400300d81b9e28f323719003cc276ef3e3d937a315e762955f269389f41b2123",
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
    console.error("ClariPix Production Error:", error);
    return NextResponse.json(
      { error: `ClariPix Engine Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
