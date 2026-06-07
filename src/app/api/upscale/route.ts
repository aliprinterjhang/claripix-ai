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

    // Official runtime using model slug instead of broken version hashes
    const output = await replicate.run(
      "nightware/real-esrgan:42fed9433dbab3cf5347dd9d1f7be0b9d363228186de578f14ef687ef00155b5",
      {
        input: {
          image: image,
          scale: 2,
          face_enhance: true
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix AI Custom Error Log:", error);
    return NextResponse.json(
      { error: `ClariPix Backend Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
