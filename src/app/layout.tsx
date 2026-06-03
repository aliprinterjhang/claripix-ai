import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClariPix AI",
  description: "AI Image Upscaler",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#030712", color: "#fff", padding: "20px" }}>
        {children}
      </body>
    </html>
  );
}
