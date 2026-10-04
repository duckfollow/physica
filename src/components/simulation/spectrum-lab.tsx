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

const MODES: { id: SpectrumMode; label: string }[] = [
  { id: "continuous", label: "แสงขาว · สเปกตรัมต่อเนื่อง" },
  { id: "hydrogen", label: "ไฮโดรเจน · เส้นเปล่งแสง" },
  { id: "sodium", label: "โซเดียม · เส้นเหลือง" },
  { id: "absorption", label: "ดูดกลืน · เส้นมืด" },
];

export function SpectrumLab() {
  const [mode, setMode] = useState<SpectrumMode>("continuous");
  const [probe, setProbe] = useState(550);
  const lines = spectrumLines(mode);
  const stripX = 80, stripW = 560, stripY = 250, stripH = 70;
  const probeX = stripX + spectrumPosition(probe) * stripW;
  const bend = prismDeviationDeg(probe);

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
          <label htmlFor="spectrum-mode">แหล่งแสง / โหมด</label>
          <select id="spectrum-mode" value={mode} onChange={(e) => setMode(e.target.value as SpectrumMode)}>
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <Slider label="ชี้ความยาวคลื่น" min={VISIBLE.min} max={VISIBLE.max} step={5} value={probe} unit="nm" onChange={setProbe} />
          <p className="hint">
            แสงขาวให้แถบสีต่อเนื่อง · ไฮโดรเจน/โซเดียมให้เส้นสว่าง · โหมดดูดกลืนคือเส้นมืดบนพื้นสีรุ้ง
          </p>
        </>
      }
      note="ช่วงมองเห็น 380–750 nm · มุมเบี่ยงเป็นแบบจำลอง Cauchy อย่างง่าย · ไม่ใช่สเปกโตรมิเตอร์จริง"
    >
      <rect x="10" y="15" width="700" height="350" rx="12" fill="#1a2420" />

      {/* white beam + prism */}
      <line x1="40" y1="120" x2="200" y2="120" stroke="#f2f5ef" strokeWidth="6" />
      <polygon points="200,70 280,170 200,170" fill="#d7e8dc" stroke="#9aac9b" strokeWidth="2" opacity="0.9" />
      <text x="40" y="48" fill="#d8e2d4">แสงเข้าปริซึม → แยกตามความยาวคลื่น</text>

      {/* fan of dispersed rays for continuous */}
      {mode === "continuous" || mode === "absorption"
        ? [400, 470, 530, 590, 650, 720].map((nm) => {
            const t = spectrumPosition(nm);
            const x2 = stripX + t * stripW;
            return (
              <line
                key={nm}
                x1="260"
                y1="130"
                x2={x2}
                y2={stripY}
                stroke={wavelengthToColor(nm, 60)}
                strokeWidth="2"
                opacity="0.75"
              />
            );
          })
        : lines.map((l) => {
            const x2 = stripX + spectrumPosition(l.wavelength) * stripW;
            return (
              <line
                key={l.label}
                x1="260"
                y1="130"
                x2={x2}
                y2={stripY}
                stroke={wavelengthToColor(l.wavelength, 62)}
                strokeWidth="3"
              />
            );
          })}

      {/* spectrum strip */}
      <rect x={stripX} y={stripY} width={stripW} height={stripH} rx="6" fill="#0d1210" stroke="#9aac9b" strokeWidth="2" />
      {(mode === "continuous" || mode === "absorption") &&
        Array.from({ length: 80 }, (_, i) => {
          const nm = VISIBLE.min + (i / 79) * (VISIBLE.max - VISIBLE.min);
          return (
            <rect
              key={i}
              x={stripX + (i / 80) * stripW}
              y={stripY}
              width={stripW / 80 + 0.5}
              height={stripH}
              fill={wavelengthToColor(nm, mode === "absorption" ? 48 : 55)}
            />
          );
        })}
      {mode === "absorption" &&
        lines.map((l) => (
          <rect
            key={l.label}
            x={stripX + spectrumPosition(l.wavelength) * stripW - 3}
            y={stripY}
            width="6"
            height={stripH}
            fill="#0d1210"
          />
        ))}
      {(mode === "hydrogen" || mode === "sodium") &&
        lines.map((l) => (
          <g key={l.label}>
            <rect
              x={stripX + spectrumPosition(l.wavelength) * stripW - 3}
              y={stripY}
              width="6"
              height={stripH}
              fill={wavelengthToColor(l.wavelength, 60)}
            />
            <text
              x={stripX + spectrumPosition(l.wavelength) * stripW}
              y={stripY - 10}
              textAnchor="middle"
              fill="#d8e2d4"
              fontSize="12"
            >
              {l.label} {l.wavelength.toFixed(0)}
            </text>
          </g>
        ))}

      <line x1={probeX} y1={stripY - 8} x2={probeX} y2={stripY + stripH + 8} stroke="#fff" strokeWidth="2" />
      <text x="40" y="360" fill="#d8e2d4">
        ม่วง ← ความยาวคลื่นสั้น · เบี่ยงมาก · แดง → ยาว · เบี่ยงน้อย · ขณะนี้ {probe} nm
      </text>
    </Frame>
  );
}
