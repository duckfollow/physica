"use client";
import { useState } from "react";
import { Frame, Slider } from "./lab-primitives";
import {
  CATEGORY_LABEL,
  allElements,
  electronShells,
  getElement,
  neighborAverage,
  type ElementCategory,
} from "@/simulations/elements";

const CAT_COLOR: Record<ElementCategory, string> = {
  alkali: "#e8b4a0",
  "alkaline-earth": "#e6c98a",
  metalloid: "#b8c9a8",
  nonmetal: "#a8c4b8",
  halogen: "#9bb8d4",
  noble: "#c4b8d4",
  "other-metal": "#d4c4a8",
};

/** Map IUPAC group to compact column index 0..7 for H–Ca teaching table. */
function colOf(group: number) {
  if (group === 1) return 0;
  if (group === 2) return 1;
  if (group === 13) return 2;
  if (group === 14) return 3;
  if (group === 15) return 4;
  if (group === 16) return 5;
  if (group === 17) return 6;
  return 7; // 18
}

export function ElementsLab() {
  const [Z, setZ] = useState(11);
  const el = getElement(Z);
  const shells = electronShells(Z);
  const prediction = neighborAverage(Z, "radiusPm");
  const maxR = 210, maxIE = 2400;

  return (
    <Frame
      title="ตารางธาตุ: เลขมวลอะตอมบอกตำแหน่งและสมบัติอย่างไร?"
      stats={[
        ["ธาตุ", `${el.symbol} · ${el.nameTh}`],
        ["คาบ / หมู่", `${el.period} / ${el.group}`],
        ["ชนิด", CATEGORY_LABEL[el.category]],
      ]}
      controls={
        <>
          <Slider label="เลขอะตอม Z" min={1} max={20} value={Z} onChange={setZ} />
          <label htmlFor="element-pick">เลือกธาตุเร็ว</label>
          <select id="element-pick" value={Z} onChange={(e) => setZ(Number(e.target.value))}>
            {allElements().map((e) => (
              <option key={e.Z} value={e.Z}>
                {e.Z}. {e.symbol} · {e.nameTh}
              </option>
            ))}
          </select>
          <p className="hint">
            เลื่อนตามคาบ 2 หรือ 3: รัศมีมักเล็กลง พลังงานไอออไนเซชันมักสูงขึ้น · ลองเทียบ Na กับ Cl
          </p>
        </>
      }
      note="ชุดสอน H–Ca · ค่าประมาณเชิงการศึกษา · โครงอิเล็กตรอนแบบเปลือก 2,8,8 ไม่ใช่โครงย่อย s/p/d"
    >
      <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3efe8" />

      {allElements().map((e) => {
        const c = colOf(e.group);
        const x = 40 + c * 42;
        const y = 40 + (e.period - 1) * 42;
        const selected = e.Z === Z;
        return (
          <g key={e.Z} onClick={() => setZ(e.Z)} style={{ cursor: "pointer" }}>
            <rect
              x={x}
              y={y}
              width="36"
              height="36"
              rx="5"
              fill={CAT_COLOR[e.category]}
              stroke={selected ? "#2f5b43" : "#8a7e6e"}
              strokeWidth={selected ? 3 : 1}
            />
            <text x={x + 18} y={y + 22} textAnchor="middle" fontSize="12" fontWeight="700">
              {e.symbol}
            </text>
          </g>
        );
      })}

      <circle cx="520" cy="130" r="8" fill="#d87951" />
      {shells.map((count, i) => {
        const r = 28 + i * 22;
        return (
          <g key={i}>
            <circle cx="520" cy="130" r={r} fill="none" stroke="#345e48" strokeWidth="1.5" opacity="0.55" />
            {Array.from({ length: count }, (_, k) => {
              const a = (2 * Math.PI * k) / count - Math.PI / 2;
              return <circle key={k} cx={520 + r * Math.cos(a)} cy={130 + r * Math.sin(a)} r="4" fill="#345e48" />;
            })}
          </g>
        );
      })}
      <text x="520" y="250" textAnchor="middle">
        เปลือก: {shells.join(" · ")}
      </text>

      <text x="40" y="230">รัศมีอะตอม ≈ {el.radiusPm} pm</text>
      <rect x="40" y="240" width="260" height="12" rx="4" fill="#e5e0d6" />
      <rect x="40" y="240" width={(el.radiusPm / maxR) * 260} height="12" rx="4" fill="#ce744b" />

      <text x="40" y="285">พลังงานไอออไนเซชันที่ 1 ≈ {el.ionizationKJ} kJ/mol</text>
      <rect x="40" y="295" width="260" height="12" rx="4" fill="#e5e0d6" />
      <rect x="40" y="295" width={(el.ionizationKJ / maxIE) * 260} height="12" rx="4" fill="#4e7fa8" />

      <text x="40" y="345">
        {prediction
          ? `เพื่อนบ้าน ${prediction.left.symbol}–${prediction.right.symbol} ทำนายรัศมี ≈ ${prediction.predicted.toFixed(0)} pm (จริง ${prediction.actual} · คลาด ${prediction.errorPct.toFixed(0)}%)`
          : "เลือกธาตุกลางคาบเพื่อเทียบการทำนายจากเพื่อนบ้านแบบเมนเดเลเยฟ"}
      </text>
    </Frame>
  );
}
