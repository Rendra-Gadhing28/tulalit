import { ImageResponse } from "next/og";
import membersData from "@/data/members.json";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function generateStaticParams() {
  return membersData.map((m) => ({ id: m.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const member = membersData.find((m) => m.id === id) || membersData[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFF8E7",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left Column: Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "650px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#6B4F3A",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            XII PPLG 3 • Sogadev × Tulalit
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: "900",
              color: "#1F2937",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            {member.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#F4B942",
                color: "#1F2937",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "6px 16px",
                borderRadius: "999px",
              }}
            >
              {member.role}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#6B4F3A",
                fontWeight: "600",
              }}
            >
              aka &quot;{member.nickname}&quot;
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "22px",
              fontStyle: "italic",
              color: "#4B5563",
              lineHeight: 1.4,
              backgroundColor: "#FFFDF9",
              padding: "16px 24px",
              borderRadius: "16px",
              border: "2px dashed #E5DEC9",
            }}
          >
            &ldquo;{member.quote}&rdquo;
          </div>
        </div>

        {/* Right Column: Polaroid Card Preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "320px",
            backgroundColor: "#FFFDF9",
            padding: "20px 20px 36px 20px",
            borderRadius: "8px",
            boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
            border: "2px solid #E5DEC9",
            transform: "rotate(2deg)",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "#1F2937",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF8E7",
              fontSize: "48px",
              fontWeight: "bold",
            }}
          >
            {member.nickname[0]}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "16px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1F2937",
            }}
          >
            {member.nickname}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              color: "#9CA3AF",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {member.rarity} Contributor
          </div>
        </div>
      </div>
    )
  );
}
