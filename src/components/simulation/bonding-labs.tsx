"use client";
import { useState } from "react";
import { Frame, Slider, Arrow } from "./lab-primitives";
import {
  BOND_PAIR_SYMBOLS, bondFromSymbols, ionicFormula, lewisPreset, type LewisPreset,
} from "@/simulations/bonding";

const PAIR_OPTS = [...BOND_PAIR_SYMBOLS];

export function BondLab() {
  const [iA, setIA] = useState(PAIR_OPTS.indexOf("H"));
  const [iB, setIB] = useState(PAIR_OPTS.indexOf("Cl"));
  const a = PAIR_OPTS[iA], b = PAIR_OPTS[iB];
  const bond = bondFromSymbols(a, b);
  const shift = bond.polarity * 50;
  const cloudX = 360 + (bond.richer === "A" ? -shift : bond.richer === "B" ? shift : 0);
  return <Frame title="พันธะ: ΔEN บอกชนิดพันธะอย่างไร?" stats={[["ΔEN", bond.delta.toFixed(2)], ["ชนิดพันธะ", bond.label], ["EN", `${a} ${bond.enA.toFixed(2)} · ${b} ${bond.enB.toFixed(2)}`]]} controls={<><Slider label={`อะตอม A (${a})`} min={0} max={PAIR_OPTS.length - 1} value={iA} onChange={setIA} /><Slider label={`อะตอม B (${b})`} min={0} max={PAIR_OPTS.length - 1} value={iB} onChange={setIB} /><p className="hint">ΔEN &lt; 0.4 ไม่มีขั้ว · 0.4–1.7 มีขั้ว · ≥ 1.7 ไอออนิก (เกณฑ์การศึกษา)</p></>} note="ค่า Pauling · เกณฑ์ตัดเป็นเชิงการศึกษา ไม่ใช่เส้นแบ่งคมในธรรมชาติ">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3efe8" />
    <circle cx="220" cy="200" r="42" fill="#6f9a78" />
    <circle cx="500" cy="200" r="42" fill="#d87951" />
    <text x="220" y="206" textAnchor="middle" className="inverse-text">{a}</text>
    <text x="500" y="206" textAnchor="middle" className="inverse-text">{b}</text>
    <ellipse cx={cloudX} cy="200" rx={70 - bond.polarity * 20} ry="36" fill="#4e7fa8" opacity="0.35" />
    <text x="40" y="48">{bond.label} · อิเล็กตรอนคู่พันธะ{bond.kind === "nonpolar" ? "อยู่กลาง" : bond.richer === "A" ? `เอนไปทาง ${a}` : `เอนไปทาง ${b}`}</text>
    <line x1="120" y1="300" x2="600" y2="300" stroke="#c5d2c6" strokeWidth="6" strokeLinecap="round" />
    <circle cx={120 + Math.min(1, bond.delta / 3.2) * 480} cy="300" r="10" fill="#345e48" />
    <text x="120" y="330">0</text><text x="330" y="330">มีขั้ว</text><text x="560" y="330">ไอออนิก</text>
  </Frame>;
}

export function IonicLab() {
  const [cat, setCat] = useState(1), [an, setAn] = useState(1);
  const f = ionicFormula(cat, an);
  const cats = Array.from({ length: f.nCat }, (_, i) => i);
  const ans = Array.from({ length: f.nAn }, (_, i) => i);
  return <Frame title="ไอออนิก: ประจุหักกันเป็นกลางอย่างไร?" stats={[["อัตราส่วน", f.ratio], ["อิเล็กตรอนที่ย้าย", `${f.transferred}`], ["เป็นกลาง", f.neutral ? "ใช่" : "ไม่"]]} controls={<><Slider label="ประจุแคตไอออน (+)" min={1} max={4} value={cat} onChange={setCat} /><Slider label="ประจุแอนไอออน (−)" min={1} max={3} value={an} onChange={setAn} /><p className="hint">เช่น +3 กับ −2 ได้ 2:3 (เช่น Al₂O₃) · จำนวนประจุบวกรวม = จำนวนประจุลบรวม</p></>} note="สูตรหน่วยเล็กสุดที่เป็นกลาง · ไม่จำลองแลตทิซสามมิติ">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef4f2" />
    {cats.map((i) => {
      const x = 160 + i * 70 - (f.nCat - 1) * 20;
      return <g key={`c${i}`}>
        <circle cx={x} cy="150" r="28" fill="#d87951" />
        <text x={x} y="156" textAnchor="middle" className="inverse-text">+{cat}</text>
      </g>;
    })}
    {ans.map((i) => {
      const x = 160 + i * 70 - (f.nAn - 1) * 20;
      return <g key={`a${i}`}>
        <circle cx={x} cy="260" r="28" fill="#4e7fa8" />
        <text x={x} y="266" textAnchor="middle" className="inverse-text">−{an}</text>
      </g>;
    })}
    <Arrow x1={420} y1={150} x2={520} y2={150} />
    <text x="540" y="156">e⁻ ย้าย {f.transferred} ตัว</text>
    <text x="40" y="48">สูตรหน่วย · อัตราส่วน {f.nCat} แคตไอออน : {f.nAn} แอนไอออน</text>
    <text x="40" y="340">โลหะเสีย e⁻ เป็นบวก · อโลหะรับ e⁻ เป็นลบ แล้วดึงกันด้วยแรงคูลอมบ์</text>
  </Frame>;
}

const LEWIS_IDS: LewisPreset[] = ["H2", "Cl2", "O2", "N2", "H2O", "CO2", "NH3", "CH4"];

export function LewisLab() {
  const [idx, setIdx] = useState(LEWIS_IDS.indexOf("H2O"));
  const id = LEWIS_IDS[idx];
  const m = lewisPreset(id);
  const cx = 360, cy = 200;
  const angles = m.n === 1 ? [0]
    : m.n === 2 ? (m.shape.includes("งอ") ? [-160, -20] : [180, 0])
    : m.n === 3 ? [-90, 150, 30]
    : [-135, -45, 45, 135];
  const bondLines = Array.from({ length: m.bondOrder }, (_, k) => k - (m.bondOrder - 1) / 2);
  return <Frame title="ลิวอิส: คู่ร่วมกับอ็อกเทตครบไหม?" stats={[["โมเลกุล", m.formula], ["เวเลนซ์รวม", `${m.totalValence}`], ["รอบอะตอมกลาง", `${m.centralAround}`], ["อ็อกเทต", m.octetsOk ? "ครบตามแบบ" : "ตรวจโครง"]]} controls={<><Slider label={`โมเลกุลตัวอย่าง (${m.formula})`} min={0} max={LEWIS_IDS.length - 1} value={idx} onChange={setIdx} /><p className="hint">เส้น = คู่ร่วม · จุด = คู่โดด · H ต้องการ 2 e⁻ ส่วนอะตอมแถว 2 มักครบ 8</p></>} note={`${m.shape} · แบบจำลองลิวอิสเชิงการศึกษา ไม่แสดงเรโซแนนซ์หรือออร์บิทัล`}>
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
    <circle cx={cx} cy={cy} r="34" fill="#345e48" />
    <text x={cx} y={cy + 6} textAnchor="middle" className="inverse-text">{m.central}</text>
    {m.centralLone > 0 && Array.from({ length: Math.min(4, Math.ceil(m.centralLone / 2)) }, (_, i) => (
      <circle key={`lone${i}`} cx={cx + (i % 2 === 0 ? -12 : 12)} cy={cy - 48 - Math.floor(i / 2) * 10} r="3" fill="#1c392c" />
    ))}
    {m.terminals.map((t, i) => {
      const ang = ((angles[i] ?? 0) * Math.PI) / 180;
      const tx = cx + Math.cos(ang) * 120;
      const ty = cy + Math.sin(ang) * 90;
      return <g key={i}>
        {bondLines.map((off) => {
          const nx = -Math.sin(ang) * off * 6;
          const ny = Math.cos(ang) * off * 6;
          return <line key={off} x1={cx + Math.cos(ang) * 34 + nx} y1={cy + Math.sin(ang) * 34 + ny} x2={tx - Math.cos(ang) * 28 + nx} y2={ty - Math.sin(ang) * 28 + ny} stroke="#6f9a78" strokeWidth="4" strokeLinecap="round" />;
        })}
        <circle cx={tx} cy={ty} r="28" fill="#d87951" />
        <text x={tx} y={ty + 6} textAnchor="middle" className="inverse-text">{t}</text>
      </g>;
    })}
    <text x="40" y="48">{m.formula} · คู่ร่วม {m.sharedPairs} คู่ · รูป {m.shape}</text>
    <text x="40" y="340">พันธะเดี่ยว/คู่/สาม = 1/2/3 คู่ร่วมระหว่างอะตอม</text>
  </Frame>;
}
