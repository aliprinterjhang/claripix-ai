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

    // Using a verified fully public upscale model runtime on Replicate
    const output = await replicate.run(
      "asadirshad/upscaler:00b95b86370be8192a2a07c3d28905bc93be81a535dc5125345d39f4ff31c4f9",
      {
        input: {
          image: image,
          face_enhance: true,
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
