import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

let fontPromise: Promise<ArrayBuffer> | null = null;

/** Load Noto Sans Thai for Satori (Thai glyphs). Cached per build. */
export function loadOgFont() {
  if (!fontPromise) {
    fontPromise = fetch(
      "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansThai/NotoSansThai-Bold.ttf",
    ).then((res) => {
      if (!res.ok) throw new Error(`OG font download failed: ${res.status}`);
      return res.arrayBuffer();
    });
  }
  return fontPromise;
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export async function ogCard({ eyebrow, title, subtitle }: OgCardProps) {
  const font = await loadOgFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #e8eedc 0%, #d5e3d0 45%, #c5d4c8 100%)",
          color: "#1c392c",
          fontFamily: "NotoSansThai",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.7 }}>{eyebrow}</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>{title}</div>
          <div style={{ fontSize: 34, lineHeight: 1.35, maxWidth: 920, opacity: 0.85 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>✳ Physica</div>
          <div style={{ fontSize: 26, opacity: 0.7 }}>เห็นแล้วลองเอง จึงเข้าใจ</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "NotoSansThai", data: font, style: "normal", weight: 700 }],
    },
  );
}
