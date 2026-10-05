"use client";
import { useState } from "react";
import { Frame, Slider } from "./lab-primitives";
import {
  VISIBLE,
  prismDeviationDeg,
  spectrumKind,
  spectrumLines,
  spectrumPosition,
  wavelengthToColor,
  type SpectrumMode,
} from "@/simulations/spectrum";

const MODES: { id: SpectrumMode; label: string; tip: string }[] = [
  { id: "continuous", label: "แสงขาว", tip: "สเปกตรัมต่อเนื่อง" },
  { id: "hydrogen", label: "ไฮโดรเจน", tip: "เส้นเปล่งแสง" },
  { id: "sodium", label: "โซเดียม", tip: "เส้นเหลือง" },
  { id: "absorption", label: "ดูดกลืน", tip: "เส้นมืดบนพื้นรุ้ง" },
];

const FAN = [400, 450, 495, 540, 590, 640, 700];

export function SpectrumLab() {
  const [mode, setMode] = useState<SpectrumMode>("continuous");
  const [probe, setProbe] = useState(550);
  const lines = spectrumLines(mode);
  const stripX = 70, stripW = 500, stripY = 232, stripH = 58;
  const probeX = stripX + spectrumPosition(probe) * stripW;
  const bend = prismDeviationDeg(probe);
  const probeColor = wavelengthToColor(probe, 58);
  const isBrightLines = mode === "hydrogen" || mode === "sodium";
  const showRainbow = mode === "continuous" || mode === "absorption";
  const sourceLabel =
    mode === "continuous" ? "แสงขาว" : mode === "absorption" ? "แสงขาว + แก๊ส" : mode === "sodium" ? "หลอด Na" : "หลอด H";
  const chipX = Math.min(Math.max(probeX - 50, 24), 520);

  return (
    <Frame
      title="สเปกตรัมแสง: แยกสีแล้วเห็นอะไร?"
      stats={[
        ["ชนิดสเปกตรัม", spectrumKind(mode)],
        ["ความยาวคลื่นที่ชี้", `${probe} nm`],
        ["มุมเบี่ยงโดยประมาณ", `${bend.toFixed(1)}°`],
      ]}
      controls={
        <>
          <p className="hint">แหล่งแสง / โหมด</p>
          <div className="sim-levels" role="group" aria-label="โหมดสเปกตรัม">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className="mode-button"
                aria-pressed={mode === m.id}
                style={mode === m.id ? { background: "#e8efd8", borderColor: "#345e48", color: "#345e48" } : undefined}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="muted">{MODES.find((m) => m.id === mode)?.tip}</p>
          <Slider label="ชี้ความยาวคลื่น" min={VISIBLE.min} max={VISIBLE.max} step={5} value={probe} unit="nm" onChange={setProbe} />
          <p className="hint">
            ม่วงสั้นกว่า → เบี่ยงมากกว่า · แดงยาวกว่า → เบี่ยงน้อยกว่า · สีที่ชี้ตอนนี้{" "}
            <span style={{ color: probeColor, fontWeight: 700 }}>{probe} nm</span>
          </p>
        </>
      }
      note="ช่วงมองเห็น 380–750 nm · มุมเบี่ยงเป็นแบบจำลอง Cauchy อย่างง่าย · ไม่ใช่สเปกโตรมิเตอร์จริง"
    >
      <defs>
        <linearGradient id="spec-stage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15201c" />
          <stop offset="100%" stopColor="#0c1210" />
        </linearGradient>
        <linearGradient id="spec-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff22" />
          <stop offset="100%" stopColor="#ffffffcc" />
        </linearGradient>
        <linearGradient id="spec-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef6f0" />
          <stop offset="100%" stopColor="#a8c4b4" />
        </linearGradient>
        <filter id="spec-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="spec-strip-clip">
          <rect x={stripX} y={stripY} width={stripW} height={stripH} rx="10" />
        </clipPath>
      </defs>

      <rect x="10" y="12" width="700" height="376" rx="18" fill="url(#spec-stage)" />

      <text x="40" y="42" fill="#d8e2d4" fontSize="14" fontWeight="700">
        แสงเข้าปริซึม → แยกตามความยาวคลื่น
      </text>
      <text x="40" y="62" fill="#8fa396" fontSize="12">
        {mode === "continuous" && "แสงขาวมีหลาย λ จึงแผ่เป็นแถบสีต่อเนื่อง"}
        {mode === "hydrogen" && "อะตอมไฮโดรเจนเปล่งได้เฉพาะบาง λ → เส้นสว่าง"}
        {mode === "sodium" && "โซเดียมเด่นที่คู่เส้นเหลืองใกล้ 589 nm"}
        {mode === "absorption" && "แก๊สดูดกลืนบาง λ → เส้นมืดบนพื้นสเปกตรัม"}
      </text>

      {/* incoming beam */}
      <rect x="36" y="98" width="150" height="14" rx="7" fill="url(#spec-beam)" />
      <circle cx="36" cy="105" r="10" fill="#f7faf6" opacity="0.9" filter="url(#spec-glow)" />
      <text x="36" y="134" fill="#c5d4c8" fontSize="11">{sourceLabel}</text>

      {/* prism */}
      <polygon points="200,64 290,164 175,164" fill="url(#spec-glass)" stroke="#d8e8de" strokeWidth="2" opacity="0.95" />
      <polygon points="210,86 268,154 198,154" fill="#ffffff33" />
      <text x="215" y="184" fill="#9fb3a6" fontSize="12">ปริซึม</text>

      {/* dispersed fan */}
      {(showRainbow ? FAN : lines.map((l) => l.wavelength)).map((nm) => {
        const x2 = stripX + spectrumPosition(nm) * stripW;
        return (
          <line
            key={nm}
            x1="268"
            y1="124"
            x2={x2}
            y2={stripY}
            stroke={wavelengthToColor(nm, 62)}
            strokeWidth={isBrightLines ? 3.5 : 2.2}
            opacity={0.85}
            strokeLinecap="round"
          />
        );
      })}
      {/* highlight probe ray */}
      <line
        x1="268"
        y1="124"
        x2={probeX}
        y2={stripY}
        stroke={probeColor}
        strokeWidth="4"
        opacity="0.95"
        strokeLinecap="round"
        filter="url(#spec-glow)"
      />

      {/* screen / spectrum strip */}
      <rect x={stripX - 8} y={stripY - 22} width={stripW + 16} height={stripH + 78} rx="14" fill="#101814" stroke="#2a3a32" />
      <rect x={stripX} y={stripY} width={stripW} height={stripH} rx="10" fill="#060908" />
      <g clipPath="url(#spec-strip-clip)">
        {showRainbow &&
          Array.from({ length: 100 }, (_, i) => {
            const nm = VISIBLE.min + (i / 99) * (VISIBLE.max - VISIBLE.min);
            return (
              <rect
                key={i}
                x={stripX + (i / 100) * stripW}
                y={stripY}
                width={stripW / 100 + 0.8}
                height={stripH}
                fill={wavelengthToColor(nm, mode === "absorption" ? 46 : 56)}
              />
            );
          })}
        {mode === "absorption" &&
          lines.map((l) => (
            <rect
              key={l.label}
              x={stripX + spectrumPosition(l.wavelength) * stripW - 3.5}
              y={stripY}
              width="7"
              height={stripH}
              fill="#060908"
            />
          ))}
        {isBrightLines &&
          lines.map((l) => (
            <rect
              key={l.label}
              x={stripX + spectrumPosition(l.wavelength) * stripW - 3.5}
              y={stripY}
              width="7"
              height={stripH}
              fill={wavelengthToColor(l.wavelength, 62)}
              filter="url(#spec-glow)"
            />
          ))}
      </g>

      {/* line labels */}
      {isBrightLines &&
        lines.map((l, i) => {
          const x = stripX + spectrumPosition(l.wavelength) * stripW;
          const stack = mode === "sodium" ? i * 16 : 0;
          return (
            <text key={l.label} x={x} y={stripY - 8 - stack} textAnchor="middle" fill="#e7efe8" fontSize="11">
              {l.label} {l.wavelength.toFixed(0)}
            </text>
          );
        })}
      {mode === "absorption" &&
        lines.map((l) => {
          const x = stripX + spectrumPosition(l.wavelength) * stripW;
          return (
            <text key={l.label} x={x} y={stripY - 8} textAnchor="middle" fill="#b8c6bb" fontSize="11">
              {l.label}
            </text>
          );
        })}

      {/* wavelength ticks */}
      {[400, 500, 600, 700].map((nm) => {
        const x = stripX + spectrumPosition(nm) * stripW;
        return (
          <g key={nm}>
            <line x1={x} y1={stripY + stripH} x2={x} y2={stripY + stripH + 7} stroke="#6f8578" strokeWidth="1.5" />
            <text x={x} y={stripY + stripH + 20} textAnchor="middle" fill="#8fa396" fontSize="11">{nm}</text>
          </g>
        );
      })}
      <text x={stripX + stripW + 8} y={stripY + stripH + 20} fill="#6f8578" fontSize="11">nm</text>

      {/* probe marker + chip below scale */}
      <line x1={probeX} y1={stripY - 4} x2={probeX} y2={stripY + stripH + 4} stroke="#fffef9" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={probeX} cy={stripY + stripH / 2} r="8" fill={probeColor} stroke="#fffef9" strokeWidth="2" filter="url(#spec-glow)" />
      <rect x={chipX} y={stripY + stripH + 32} width="100" height="34" rx="10" fill="#1c2923" stroke={probeColor} strokeWidth="1.5" />
      <text x={chipX + 50} y={stripY + stripH + 47} textAnchor="middle" fill="#eef4ef" fontSize="12" fontWeight="700">
        {probe} nm
      </text>
      <text x={chipX + 50} y={stripY + stripH + 60} textAnchor="middle" fill="#9fb3a6" fontSize="11">
        เบี่ยง ~{bend.toFixed(1)}°
      </text>

      {/* side legend card */}
      <g transform="translate(590,64)">
        <rect x="0" y="0" width="108" height="168" rx="12" fill="#18241f" stroke="#2f4138" />
        <text x="54" y="22" textAnchor="middle" fill="#d8e2d4" fontSize="12" fontWeight="700">อ่านแถบ</text>
        <rect x="10" y="32" width="88" height="40" rx="8" fill={showRainbow && mode === "continuous" ? "#24332c" : "transparent"} />
        <rect x="18" y="40" width="72" height="10" rx="3" fill="url(#spec-beam)" />
        <text x="54" y="64" textAnchor="middle" fill={mode === "continuous" ? "#e8efd8" : "#9fb3a6"} fontSize="10">ต่อเนื่อง</text>
        <rect x="10" y="76" width="88" height="40" rx="8" fill={isBrightLines ? "#24332c" : "transparent"} />
        <line x1="30" y1="84" x2="30" y2="102" stroke={wavelengthToColor(656, 60)} strokeWidth="4" />
        <line x1="54" y1="84" x2="54" y2="102" stroke={wavelengthToColor(486, 60)} strokeWidth="4" />
        <line x1="78" y1="84" x2="78" y2="102" stroke={wavelengthToColor(434, 60)} strokeWidth="4" />
        <text x="54" y="116" textAnchor="middle" fill={isBrightLines ? "#e8efd8" : "#9fb3a6"} fontSize="10">เปล่งแสง</text>
        <rect x="10" y="124" width="88" height="36" rx="8" fill={mode === "absorption" ? "#24332c" : "transparent"} />
        <rect x="18" y="132" width="72" height="8" rx="2" fill={wavelengthToColor(550, 45)} />
        <rect x="48" y="132" width="6" height="8" fill="#060908" />
        <text x="54" y="152" textAnchor="middle" fill={mode === "absorption" ? "#e8efd8" : "#9fb3a6"} fontSize="10">ดูดกลืน</text>
      </g>
    </Frame>
  );
}
