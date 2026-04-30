import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width="64"
          height="56"
          viewBox="0 0 76 65"
          fill="white"
        >
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-2px",
          }}
        >
          Vercel Swag Store
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          Official merchandise for builders who ship
        </div>
      </div>
    ),
    size
  );
}
