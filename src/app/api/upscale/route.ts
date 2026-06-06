import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image, scale } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "AI Gateway Key missing! Please set REPLICATE_API_TOKEN in Vercel settings." }, { status: 500 });
    }

    // Real-ESRGAN Model API endpoint on Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Model: nightware/real-esrgan
        version: "42fed9433dbab3cf5347dd9d1f7be0b9d363228186de578f14ef687ef00155b5",
        input: {
          image: image,
          scale: scale || 2,
          face_enhance: true
        }
      })
    });

    let prediction = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: prediction.detail || "Failed to initiate AI model" }, { status: response.status });
    }

    // Poll the status until it's finished
    const predictionId = prediction.id;
    let status = prediction.status;
    
    while (status !== "succeeded" && status !== "failed" && status !== "canceled") {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // wait 1.5s
      const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { "Authorization": `Token ${token}` }
      });
      prediction = await checkResponse.json();
      status = prediction.status;
    }

    if (status === "succeeded") {
      return NextResponse.json({ output: prediction.output });
    } else {
      return NextResponse.json({ error: "AI processing failed mid-way." }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
