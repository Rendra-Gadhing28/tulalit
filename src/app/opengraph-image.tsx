import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF8E7",
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Polaroids border frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFDF9",
            border: "8px solid #E5DEC9",
            borderRadius: "24px",
            padding: "40px 60px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#6B4F3A",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {siteConfig.schoolName} • Angkatan {siteConfig.academicYear}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: "900",
              color: "#1F2937",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            {siteConfig.className}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "36px",
              fontWeight: "bold",
              color: "#FF6B6B",
              marginBottom: "20px",
            }}
          >
            {siteConfig.circleName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: "#64748B",
              fontStyle: "italic",
            }}
          >
            &ldquo;{siteConfig.tagline}&rdquo;
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
