import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0B1220 0%, #111C2E 60%, #1E1B4B 100%)",
          color: "#F8FAFC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 6,
              padding: 16,
            }}
          >
            <div style={{ width: 9, height: 16, background: "#fff", borderRadius: 3, opacity: 0.75 }} />
            <div style={{ width: 9, height: 28, background: "#fff", borderRadius: 3, opacity: 0.9 }} />
            <div style={{ width: 9, height: 38, background: "#fff", borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 48, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ marginTop: 56, fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
          Stop watching tutorials. Start solving real data problems.
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#94A3B8" }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
