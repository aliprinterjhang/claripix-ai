"use client";

import { useState } from "react";

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setStatus("ready");
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("done");
    }, 2000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#6366f1" }}>ClariPix AI</h1>
      <p style={{ color: "#94a3b8" }}>Apni blurry photo ko clear aur HD banayein</p>

      <div style={{ border: "2px dashed #334155", padding: "40px", borderRadius: "15px", margin: "20px 0", background: "#0f172a" }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: "15px" }} />
        <p style={{ fontSize: "12px", color: "#64748b" }}>PNG, JPG ya WEBP photo select karein</p>
      </div>

      {image && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview Screen:</h3>
          <img src={image} alt="Preview" style={{ width: "100%", borderRadius: "10px", filter: status === "ready" ? "blur(2px)" : "none" }} />

          {status === "ready" && (
            <button onClick={processImage} style={{ marginTop: "15px", padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
              AI Se Photo Clear Karein
            </button>
          )}

          {status === "processing" && <p style={{ color: "#fbbf24", fontWeight: "bold" }}>AI Processing chal rahi hai... Please wait...</p>}
          {status === "done" && <p style={{ color: "#34d399", fontWeight: "bold" }}>✨ Photo HD mein convert ho chuki hai!</p>}
        </div>
      )}
    </div>
  );
}
