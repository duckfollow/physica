"use client";
import { useState } from "react";
import { Frame, Slider, Playback, useClock, Arrow } from "./lab-primitives";
import { magnetPoles, lorentzForce, faradayLoop } from "@/simulations/magnetism";

export function MagnetLab() {
  const [facingA, setFacingA] = useState<1 | -1>(1);
  const [facingB, setFacingB] = useState<1 | -1>(-1);
  const [dist, setDist] = useState(12);
  const [strength, setStrength] = useState(1.2);
  const m = magnetPoles(facingA, facingB, dist, strength);
  const gap = 80 + dist * 4;
  const x1 = 360 - gap / 2, x2 = 360 + gap / 2;
  const label = (p: 1 | -1) => (p === 1 ? "N" : "S");
  return <Frame title="แม่เหล็กแท่ง: ขั้วเหมือนผลักไหม?" stats={[["แรงสัมพัทธ์", m.magnitude.toFixed(2)], ["ทิศ", m.repulsive ? "ผลัก" : "ดึง"], ["ระยะ", `${dist} cm`]]} controls={<><Slider label="ขั้วที่หันเข้าหากันของแท่งซ้าย (−1 = S, 1 = N)" min={-1} max={1} step={2} value={facingA} onChange={(v) => setFacingA(v >= 0 ? 1 : -1)} /><Slider label="ขั้วที่หันเข้าหากันของแท่งขวา (−1 = S, 1 = N)" min={-1} max={1} step={2} value={facingB} onChange={(v) => setFacingB(v >= 0 ? 1 : -1)} /><Slider label="ระยะห่าง" min={4} max={28} value={dist} unit="cm" onChange={setDist} /><Slider label="ความแรงสัมพัทธ์" min={0.4} max={2} step={0.1} value={strength} onChange={setStrength} /><p className="hint">N หันเข้าหา N หรือ S หันเข้าหา S → ผลัก · ขั้วต่างกัน → ดึง · ระยะใกล้แรงมากขึ้น</p></>} note="แบบจำลองเชิงการศึกษา · แรงสัมพัทธ์ ∝ 1/r² · ไม่ใช่ค่าจริงของแม่เหล็กชนิดใดชนิดหนึ่ง">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
    {[0.55, 0.75, 0.95].map((s, i) => (
      <path key={i} d={`M${x1 + 50} 200 C${x1 + 80} ${120 + i * 40}, ${x2 - 80} ${120 + i * 40}, ${x2 - 50} 200`} fill="none" stroke="#9aac9b" strokeWidth="1.5" strokeDasharray="4 4" opacity={0.7 - i * 0.15} />
    ))}
    <g transform={`translate(${x1},200)`}>
      <rect x={-70} y={-28} width="120" height="56" rx="8" fill="#345e48" />
      <rect x={facingA === 1 ? -70 : 10} y={-28} width="60" height="56" rx="8" fill="#d87951" />
      <text x={facingA === 1 ? -40 : 40} y="6" textAnchor="middle" className="inverse-text">{label(facingA)}</text>
      <text x={facingA === 1 ? 40 : -40} y="6" textAnchor="middle" className="inverse-text">{label(facingA === 1 ? -1 : 1)}</text>
    </g>
    <g transform={`translate(${x2},200)`}>
      <rect x={-50} y={-28} width="120" height="56" rx="8" fill="#345e48" />
      <rect x={facingB === 1 ? -50 : 10} y={-28} width="60" height="56" rx="8" fill="#d87951" />
      <text x={facingB === 1 ? -20 : 40} y="6" textAnchor="middle" className="inverse-text">{label(facingB)}</text>
      <text x={facingB === 1 ? 40 : -20} y="6" textAnchor="middle" className="inverse-text">{label(facingB === 1 ? -1 : 1)}</text>
    </g>
    {m.repulsive
      ? <><Arrow x1={x1 - 90} y1={200} x2={x1 - 130} y2={200} /><Arrow x1={x2 + 90} y1={200} x2={x2 + 130} y2={200} color="#8a6a4a" /></>
      : <><Arrow x1={x1 + 60} y1={200} x2={x1 + 100} y2={200} /><Arrow x1={x2 - 60} y1={200} x2={x2 - 100} y2={200} color="#8a6a4a" /></>}
    <text x="40" y="48">ขั้วเหมือนกันผลัก · ขั้วต่างกันดึง</text>
  </Frame>;
}

export function LorentzLab() {
  const [q, setQ] = useState(1), [v, setV] = useState(2), [B, setB] = useState(40), [angle, setAngle] = useState(90);
  const L = lorentzForce(q, 1, v, B, angle);
  const clock = useClock();
  const R = Number.isFinite(L.radius) ? Math.min(120, Math.max(18, L.radius / 8e-3)) : 0;
  const omega = Number.isFinite(L.period) && L.period > 0 ? ((2 * Math.PI) / L.period) * 4e-7 : 0;
  const sense = L.sense === "ccw" ? 1 : -1;
  const t = clock.time * omega * sense;
  const cx = 360, cy = 210;
  const px = cx + (R || 0) * Math.cos(t);
  const py = cy + (R || 0) * Math.sin(t);
  return <Frame title="ลอเรนซ์: ประจุในสนามแม่เหล็ก?" stats={[["แรงแม่เหล็ก", `${L.magnitude.toExponential(2)} N`], ["รัศมีวงโคจร", Number.isFinite(L.radius) ? `${(L.radius * 100).toFixed(1)} cm` : "—"], ["คาบ", Number.isFinite(L.period) ? `${(L.period * 1e6).toFixed(2)} μs` : "—"]]} controls={<><Slider label="ประจุ (เท่าของ e)" min={-2} max={2} step={1} value={q} onChange={(val) => { clock.reset(); setQ(val); }} /><Slider label="ความเร็ว" min={0.5} max={5} step={0.1} value={v} unit="×10⁶ m/s" onChange={(val) => { clock.reset(); setV(val); }} /><Slider label="สนาม B" min={5} max={80} step={1} value={B} unit="mT" onChange={(val) => { clock.reset(); setB(val); }} /><Slider label="มุมระหว่าง v กับ B" min={0} max={90} step={5} value={angle} unit="°" onChange={(val) => { clock.reset(); setAngle(val); }} /><Playback clock={clock} /><p className="hint">มุม 90° → วงกลม · มุม 0° → ไม่มีแรงแม่เหล็ก · ประจุลบหมุนทิศกลับ</p></>} note="มวล = 1 เท่าโปรตอน · B ตั้งฉากกับระนาบภาพ · F = qvB sinθ">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef4f2" />
    {Array.from({ length: 8 }, (_, i) => Array.from({ length: 5 }, (_, j) => (
      <text key={`${i}-${j}`} x={80 + i * 80} y={60 + j * 70} fill="#9aac9b" fontSize="14">×</text>
    )))}
    {R > 0 && <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c5d2c6" strokeDasharray="5 4" />}
    {R > 0
      ? <circle cx={px} cy={py} r="10" fill={q >= 0 ? "#d87951" : "#4e7fa8"} />
      : <circle cx={cx} cy={cy} r="10" fill={q >= 0 ? "#d87951" : "#4e7fa8"} />}
    <text x="40" y="48">B เข้าหาหน้าจอ (×) · r = mv⊥/|q|B</text>
    <text x="40" y="360">{angle === 0 ? "v ขนาน B → ไม่โค้ง" : `ทิศหมุน ${L.sense === "ccw" ? "ทวนเข็ม" : "ตามเข็ม"} สำหรับประจุ ${q >= 0 ? "บวก" : "ลบ"}`}</text>
  </Frame>;
}

export function FaradayLab() {
  const [turns, setTurns] = useState(40), [B, setB] = useState(50), [area, setArea] = useState(80), [rpm, setRpm] = useState(120);
  const clock = useClock();
  const f = faradayLoop(turns, B, area, rpm, clock.time);
  const angle = (f.theta * 180) / Math.PI;
  const needle = Math.max(-70, Math.min(70, f.emf * 8));
  return <Frame title="แฟราเดย์: หมุนวงลวดแล้วมีแรงดันไหม?" stats={[["ε เหนี่ยวนำ", `${f.emf.toFixed(3)} V`], ["ฟลักซ์ Φ", `${(f.flux * 1e3).toFixed(3)} mWb`], ["ε สูงสุด", `${f.peakEmf.toFixed(3)} V`]]} controls={<><Slider label="จำนวนรอบ N" min={5} max={120} step={5} value={turns} onChange={(v) => { clock.reset(); setTurns(v); }} /><Slider label="สนาม B" min={5} max={120} step={5} value={B} unit="mT" onChange={(v) => { clock.reset(); setB(v); }} /><Slider label="พื้นที่วง" min={20} max={200} step={5} value={area} unit="cm²" onChange={(v) => { clock.reset(); setArea(v); }} /><Slider label="ความเร็วหมุน" min={0} max={300} step={10} value={rpm} unit="rpm" onChange={(v) => { clock.reset(); setRpm(v); }} /><Playback clock={clock} /><p className="hint">หยุดหมุน → ε = 0 · เพิ่ม rpm หรือ B หรือ N → แรงดันพีคสูงขึ้น</p></>} note="วงลวดหมุนใน B สม่ำเสมอ · ε = N B A ω sin(ωt) · ไม่คิดความต้านทานวง">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3efe8" />
    <ellipse cx="220" cy="200" rx="90" ry="50" fill="none" stroke="#345e48" strokeWidth="4" transform={`rotate(${angle % 360} 220 200)`} />
    <line x1="220" y1="150" x2="220" y2="250" stroke="#9aac9b" strokeWidth="2" />
    <text x="160" y="48">วงหมุนใน B</text>
    <rect x="420" y="80" width="220" height="220" rx="12" fill="#fffef9" stroke="#c5d2c6" />
    <text x="530" y="110" textAnchor="middle">โวลต์มิเตอร์</text>
    <line x1="530" y1="200" x2="530" y2="200" stroke="#345e48" />
    <line x1="530" y1="200" x2={530 + needle} y2={200 - Math.abs(needle) * 0.2} stroke="#d87951" strokeWidth="4" strokeLinecap="round" />
    <circle cx="530" cy="200" r="6" fill="#1c392c" />
    <text x="450" y="280">−</text><text x="600" y="280">+</text>
    <text x="40" y="360">ε พุ่งเมื่อฟลักซ์เปลี่ยนเร็ว · นิ่งแล้ว ε เป็นศูนย์</text>
  </Frame>;
}
