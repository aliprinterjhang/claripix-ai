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

    // Using sczhou/codeformer which is active, premium, and fully supported on Replicate
    const output = await replicate.run(
      "sczhou/codeformer:7de2ac143916f53a702d1ec9e46b0d3611dc1c25259cfd75d7939ce97fe035bb",
      {
        input: {
          image: image,
          upscale: 4, // 4x enhancement for high resolution posters/flexes
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.7
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
