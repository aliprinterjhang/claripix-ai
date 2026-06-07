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

    // Explicitly using codeformer with a fresh verified hash
    const output = await replicate.run(
      "sczhou/codeformer:7de2ac143916f53a702d1ec9e46b0d3611dc1c25259cfd75d7939ce97fe035bb",
      {
        input: {
          image: image,
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.5
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("ClariPix AI Custom Error Log:", error);
    // Hum error message ko customize kar rahe hain taake pata chale naya code chal raha hai
    return NextResponse.json(
      { error: `ClariPix Backend Error: ${error.message}` },
      { status: 500 }
    );
  }
}
