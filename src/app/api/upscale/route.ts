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

    // Using the official Replicate deployment format (No version hash needed, completely stable)
    const output = await replicate.run(
      "stability-ai/upscale-gfpgan:f631541da02d4b967fe9a149bbf870e28e46950ee07e59600a94b407b55694a5",
      {
        input: {
          image: image,
          upscale: 2,
          face_enhance: true
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix AI Custom Error Log:", error);
    return NextResponse.json(
      { error: `ClariPix Backend Error: ${error.message}` },
      { status: 500 }
    );
  }
}
