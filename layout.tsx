*(Kyuki aap pehle hi src/app folder ke andar honge, isliye sirf layout.tsx likhna kafi hai).*
* **Code (Niche box mein):**
  ```typescript
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
