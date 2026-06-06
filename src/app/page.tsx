"use client";

import { useState } from "react";

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState<string>("2");
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setOutputImage(null);
        setStatus("ready");
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setStatus("processing");
    setErrorMessage("");

    try {
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, scale: parseInt(scale) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upscaling failed");
      }

      setOutputImage(data.output);
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Kuch masla hua hai. Dobara try karein.");
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", textAlign: "center", fontFamily: "sans-serif", background: "#0b0f19", color: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#6366f1", marginBottom: "5px" }}>ClariPix AI</h1>
      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Apni blurry photo ko clear aur HD banayein</p>

      <div style={{ border: "2px dashed #334155", padding: "30px", borderRadius: "15px", background: "#0f172a", marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: "15px", color: "#94a3b8" }} />
        <p style={{ fontSize: "12px", color: "#64748b" }}>PNG, JPG ya WEBP photo select karein</p>
      </div>

      {image && (
        <div style={{ marginTop: "20px", background: "#0f172a", padding: "20px", borderRadius: "15px" }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#94a3b8" }}>Upscale Size Select Karein:</span>
            <select 
              value={scale} 
              onChange={(e) => setScale(e.target.value)}
              style={{ background: "#1e293b", color: "#fff", padding: "8px 15px", borderRadius: "8px", border: "1px solid #475569", cursor: "pointer" }}
            >
              <option value="2">2x (HD)</option>
              <option value="4">4x (Ultra HD)</option>
              <option value="6">6x (Super Resolution)</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: outputImage ? "1fr 1fr" : "1fr", gap: "15px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "5px" }}>Original Photo</p>
              <img src={image} alt="Original" style={{ width: "100%", borderRadius: "10px" }} />
            </div>
            {outputImage && (
              <div>
                <p style={{ fontSize: "14px", color: "#34d399", marginBottom: "5px" }}>✨ HD Upscaled ({scale}x)</p>
                <img src={outputImage} alt="Upscaled" style={{ width: "100%", borderRadius: "10px" }} />
              </div>
            )}
          </div>
          
          {status === "ready" && (
            <button onClick={processImage} style={{ marginTop: "20px", padding: "12px 25px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
              AI Se Photo Clear Karein
            </button>
          )}

          {status === "processing" && (
            <div style={{ marginTop: "20px" }}>
              <p style={{ color: "#fbbf24", fontWeight: "bold" }}>AI Processing chal rahi hai... Isme 10-15 seconds lag sakte hain...</p>
            </div>
          )}

          {status === "error" && (
            <p style={{ color: "#ef4444", fontWeight: "bold", marginTop: "15px" }}>❌ {errorMessage}</p>
          )}

          {status === "done" && outputImage && (
            <a href={outputImage} download="claripix-hd.png" target="_blank" rel="noreferrer">
              <button style={{ marginTop: "20px", padding: "12px 25px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
                ⤵️ High Quality Image Download Karein
              </button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
