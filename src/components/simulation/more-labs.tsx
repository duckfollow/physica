"use client";
import { useMemo, useState } from "react";
import { Frame, Slider, Playback, useClock, Arrow } from "./lab-primitives";
import {
  dopplerHeard, coulombForce, heatConduction, dnaComplementStrand, dnaMatchCount,
  sineWave, foucaultRate, brownianPath, oerstedField,
} from "@/simulations/more";

export function DopplerLab() {
  const [f0, setF0] = useState(440), [vObs, setVObs] = useState(0), [vSrc, setVSrc] = useState(20);
  const d = dopplerHeard(f0, 340, vObs, vSrc);
  const clock = useClock();
  const phase = clock.time * d.frequency * 0.02;
  const wave = Array.from({ length: 80 }, (_, i) => {
    const x = 80 + i * 7;
    return `${x},${200 + 40 * Math.sin(i * 0.35 - phase)}`;
  }).join(" ");
  return <Frame title="ดอปเพลอร์: ได้ยินสูงขึ้นหรือต่ำลง?" stats={[["ความถี่ต้น", `${f0} Hz`], ["ความถี่ที่ได้ยิน", `${d.frequency.toFixed(1)} Hz`], ["การเลื่อน", `${d.shift >= 0 ? "+" : ""}${d.shift.toFixed(1)} Hz`]]} controls={<><Slider label="ความถี่ต้น" min={200} max={800} step={10} value={f0} unit="Hz" onChange={(v) => { clock.reset(); setF0(v); }} /><Slider label="ความเร็วผู้สังเกต (บวก = เข้าหา)" min={-40} max={40} value={vObs} unit="m/s" onChange={(v) => { clock.reset(); setVObs(v); }} /><Slider label="ความเร็วแหล่ง (บวก = เข้าหาผู้ฟัง)" min={-40} max={100} value={vSrc} unit="m/s" onChange={(v) => { clock.reset(); setVSrc(v); }} /><Playback clock={clock} /><p className="hint">แหล่งเข้าหา → ได้ยินสูงขึ้น · แหล่งถอยออก → ต่ำลง · vเสียง = 340 m/s</p></>} note="เสียงในอากาศนิ่ง · เคลื่อนที่แนวเส้นตรงเข้าหากัน">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
    <circle cx="120" cy="200" r="28" fill="#d87951" />
    <text x="120" y="205" textAnchor="middle" className="inverse-text">src</text>
    <circle cx="600" cy="200" r="28" fill="#345e48" />
    <text x="600" y="205" textAnchor="middle" className="inverse-text">หู</text>
    <polyline points={wave} fill="none" stroke="#4e7fa8" strokeWidth="3" />
    <text x="40" y="48">f′ = {d.frequency.toFixed(1)} Hz</text>
  </Frame>;
}

export function CoulombLab() {
  const [q1, setQ1] = useState(2), [q2, setQ2] = useState(-2), [r, setR] = useState(0.1);
  const c = coulombForce(q1, q2, r);
  const gap = 120 + r * 800;
  const x1 = 360 - gap / 2, x2 = 360 + gap / 2;
  return <Frame title="คูลอมบ์: ประจุดึงหรือผลัก?" stats={[["แรง", `${c.magnitude.toExponential(2)} N`], ["ทิศ", c.repulsive ? "ผลัก" : "ดึง"], ["ระยะ", `${r.toFixed(2)} m`]]} controls={<><Slider label="ประจุ q₁" min={-5} max={5} step={0.5} value={q1} unit="μC" onChange={setQ1} /><Slider label="ประจุ q₂" min={-5} max={5} step={0.5} value={q2} unit="μC" onChange={setQ2} /><Slider label="ระยะห่าง" min={0.05} max={0.4} step={0.01} value={r} unit="m" onChange={setR} /><p className="hint">ประจุต่างชนิดดึง · ประจุชนิดเดียวกันผลัก · ระยะเพิ่มสองเท่า แรงลดประมาณสี่เท่า</p></>} note="จุดประจุในสุญญากาศ · k = 8.99×10⁹">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef4f2" />
    <circle cx={x1} cy="200" r={18 + Math.abs(q1) * 3} fill={q1 >= 0 ? "#d87951" : "#4e7fa8"} />
    <circle cx={x2} cy="200" r={18 + Math.abs(q2) * 3} fill={q2 >= 0 ? "#d87951" : "#4e7fa8"} />
    <text x={x1} y="205" textAnchor="middle" className="inverse-text">{q1 >= 0 ? "+" : "−"}</text>
    <text x={x2} y="205" textAnchor="middle" className="inverse-text">{q2 >= 0 ? "+" : "−"}</text>
    {c.repulsive
      ? <><Arrow x1={x1 - 40} y1={200} x2={x1 - 40 - 40} y2={200} /><Arrow x1={x2 + 40} y1={200} x2={x2 + 40 + 40} y2={200} color="#8a6a4a" /></>
      : <><Arrow x1={x1 + 30} y1={200} x2={x1 + 70} y2={200} /><Arrow x1={x2 - 30} y1={200} x2={x2 - 70} y2={200} color="#8a6a4a" /></>}
    <text x="40" y="48">F = k|q₁q₂|/r²</text>
  </Frame>;
}

export function ConductionLab() {
  const [k, setK] = useState(200), [dT, setDT] = useState(80), [L, setL] = useState(0.4);
  const A = 0.001;
  const h = heatConduction(k, A, dT, L);
  const tHot = 20 + dT;
  const segs = 24;
  return <Frame title="การนำความร้อน: ความร้อนไหลเร็วแค่ไหน?" stats={[["อัตราการส่งผ่าน", `${h.rate.toFixed(1)} W`], ["ความชันอุณหภูมิ", `${h.gradient.toFixed(0)} °C/m`], ["ΔT", `${dT} °C`]]} controls={<><Slider label="สภาพนำความร้อน k" min={20} max={400} step={10} value={k} unit="W/(m·K)" onChange={setK} /><Slider label="ผลต่างอุณหภูมิ" min={10} max={120} step={5} value={dT} unit="°C" onChange={setDT} /><Slider label="ความยาวแท่ง" min={0.1} max={0.8} step={0.05} value={L} unit="m" onChange={setL} /><p className="hint">โลหะ k สูง → ส่งผ่านเร็ว · แท่งยาวขึ้นอัตราลด · พื้นที่หน้าตัดคงที่ 10 cm²</p></>} note="สถานะคงตัวหนึ่งมิติ · ไม่คิดการพาความร้อนหรือการแผ่รังสี">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3efe8" />
    {Array.from({ length: segs }, (_, i) => {
      const x = i / (segs - 1);
      const t = h.tempAt(x * L, tHot);
      const hue = 220 - (t / Math.max(1, tHot)) * 200;
      return <rect key={i} x={120 + i * (480 / segs)} y="150" width={480 / segs + 1} height="80" fill={`hsl(${hue} 70% 60%)`} />;
    })}
    <text x="120" y="140">ร้อน {tHot.toFixed(0)}°C</text>
    <text x="560" y="140">เย็น 20°C</text>
    <text x="40" y="48">Q/t = kAΔT/L = {h.rate.toFixed(1)} J/s</text>
  </Frame>;
}

export function DnaLab() {
  const [seq, setSeq] = useState("ATGCGA");
  const complement = dnaComplementStrand(seq);
  const stats = dnaMatchCount(seq);
  const bases = [...seq.toUpperCase()];
  const comps = [...complement];
  return <Frame title="DNA: คู่เบสจับกันอย่างไร?" stats={[["ความยาว", `${stats.length} เบส`], ["จำนวน G+C", `${stats.gc}`], ["สายคู่สม", complement || "—"]]} controls={<><label htmlFor="dna-seq">สายต้นแบบ (A T C G)</label><input id="dna-seq" value={seq} onChange={(e) => setSeq(e.target.value.replace(/[^ATCGatcg]/g, "").slice(0, 12).toUpperCase())} /><p className="hint">A จับ T · C จับ G · ลองพิมพ์ ATGC แล้วดูสายคู่สม</p></>} note="กฎคู่สมของเบส · ไม่จำลองฮีลิกซ์สามมิติหรือเอนไซม์">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#e7f0e4" />
    {bases.map((b, i) => {
      const x = 80 + i * 90;
      const pair = comps[i];
      const ok = pair === "T" || pair === "A" || pair === "G" || pair === "C";
      return <g key={i}>
        <rect x={x} y="100" width="60" height="50" rx="8" fill="#6f9a78" />
        <text x={x + 30} y="132" textAnchor="middle" className="inverse-text">{b || "·"}</text>
        <line x1={x + 30} y1="150" x2={x + 30} y2="210" stroke={ok ? "#345e48" : "#b56845"} strokeWidth="3" strokeDasharray="4 3" />
        <rect x={x} y="210" width="60" height="50" rx="8" fill="#d87951" />
        <text x={x + 30} y="242" textAnchor="middle" className="inverse-text">{pair}</text>
      </g>;
    })}
    <text x="40" y="48">สายบน = ต้นแบบ · สายล่าง = คู่สม</text>
    <text x="40" y="340">A–T มี 2 พันธะไฮโดรเจน · C–G มี 3 (เชิงสัญลักษณ์)</text>
  </Frame>;
}

export function SineLab() {
  const [A, setA] = useState(2), [T, setT] = useState(4), [phi, setPhi] = useState(0);
  const ox = 360, oy = 220, sx = 28, sy = 28;
  const pts = Array.from({ length: 121 }, (_, i) => {
    const x = -10 + i / 6;
    return `${ox + x * sx},${oy - sineWave(A, T, phi, x) * sy}`;
  }).join(" ");
  return <Frame title="กราฟไซน์: แอมพลิจูด คาบ เฟส" stats={[["แอมพลิจูด", A.toFixed(1)], ["คาบ", T.toFixed(1)], ["เฟส", `${phi}°`]]} controls={<><Slider label="แอมพลิจูด A" min={0.5} max={4} step={0.1} value={A} onChange={setA} /><Slider label="คาบ T" min={1} max={10} step={0.5} value={T} onChange={setT} /><Slider label="เฟส φ" min={-180} max={180} step={15} value={phi} onChange={setPhi} /><p className="hint">เพิ่ม A → สูงขึ้น · เพิ่ม T → คลื่นยืด · เปลี่ยน φ → เลื่อนซ้าย–ขวา</p></>} note="y = A sin(2πx/T + φ) · สเกลแกนคงที่">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3f6f8" />
    <line x1="80" y1={oy} x2="640" y2={oy} stroke="#9aafb8" /><line x1={ox} y1="40" x2={ox} y2="360" stroke="#9aafb8" />
    <polyline points={pts} fill="none" stroke="#345e48" strokeWidth="3.5" />
    <text x="40" y="48">y = {A.toFixed(1)} sin(2πx/{T.toFixed(1)} + {phi}°)</text>
  </Frame>;
}

export function FoucaultLab() {
  const [lat, setLat] = useState(13.7);
  const f = foucaultRate(lat);
  const clock = useClock();
  const angle = (clock.time * f.omega) % (2 * Math.PI);
  const swing = 0.7 * Math.sin(clock.time * 2.2);
  const x = 360 + 140 * Math.sin(angle) * swing;
  const y = 220 + 140 * Math.cos(angle) * Math.abs(swing);
  return <Frame title="ฟูโกต์: ลูกตุ้มบอกว่าโลกหมุน?" stats={[["ละติจูด", `${lat.toFixed(1)}°`], ["อัตราพรีเซสชัน", `${f.degPerHour.toFixed(2)} °/h`], ["คาบพรีเซสชัน", Number.isFinite(f.periodHours) ? `${f.periodHours.toFixed(1)} h` : "∞"]]} controls={<><Slider label="ละติจูด" min={0} max={90} step={0.5} value={lat} unit="°" onChange={(v) => { clock.reset(); setLat(v); }} /><Playback clock={clock} /><p className="hint">ที่ขั้วโลกหมุนระนาบเร็วสุด · ที่ศูนย์สูตรไม่พรีเซส · กรุงเทพฯ ≈ 13.7°</p></>} note="Ω_earth sinφ · ไม่จำลองแรงเสียดทานหรือนัทเทชัน">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
    <ellipse cx="360" cy="220" rx="160" ry="90" fill="none" stroke="#c5d2c6" strokeDasharray="6 5" />
    <line x1="360" y1="80" x2={x} y2={y} stroke="#345e48" strokeWidth="3" />
    <circle cx={x} cy={y} r="12" fill="#d87951" />
    <text x="40" y="48">ระนาบแกว่งหมุนเทียบพื้นโลก</text>
  </Frame>;
}

export function BrownianLab() {
  const [steps, setSteps] = useState(180), [seed, setSeed] = useState(3);
  const path = useMemo(() => brownianPath(steps, 1.2, seed), [steps, seed]);
  const clock = useClock((path.points.length - 1) / 40);
  const idx = Math.min(path.points.length - 1, Math.floor(clock.time * 40));
  const scale = 3.2, cx = 360, cy = 200;
  const poly = path.points.slice(0, idx + 1).map((p) => `${cx + p.x * scale},${cy - p.y * scale}`).join(" ");
  const p = path.points[idx];
  return <Frame title="บราวเนียน: จุดเล็กสั่นสุ่มเพราะอะไร?" stats={[["ก้าวที่", `${idx}`], ["ระยะจากจุดเริ่ม", `${Math.hypot(p.x, p.y).toFixed(1)}`], ["ปลายทาง", `${path.distance.toFixed(1)}`]]} controls={<><Slider label="จำนวนก้าว" min={40} max={300} step={10} value={steps} onChange={(v) => { clock.reset(); setSteps(v); }} /><Slider label="ชุดสุ่ม (seed)" min={1} max={20} value={seed} onChange={(v) => { clock.reset(); setSeed(v); }} /><Playback clock={clock} /><p className="hint">โมเลกุลของเหลวชนอนุภาคเล็กแบบสุ่ม ทำให้เส้นทางคดเคี้ยว</p></>} note="การเดินสุ่มสองมิติเชิงการศึกษา · ไม่ใช่ค่าคงที่การแพร่จริง">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef4f2" />
    <polyline points={poly} fill="none" stroke="#345e48" strokeWidth="2" />
    <circle cx={cx} cy={cy} r="4" fill="#9aac9b" />
    <circle cx={cx + p.x * scale} cy={cy - p.y * scale} r="8" fill="#d87951" />
    <text x="40" y="48">เส้นทางสุ่มของอนุภาค</text>
  </Frame>;
}

export function OerstedLab() {
  const [I, setI] = useState(3), [r, setR] = useState(0.08);
  const o = oerstedField(I, r);
  const clock = useClock();
  return <Frame title="เออร์สเตด: สายไฟหมุนเข็มทิศไหม?" stats={[["กระแส", `${I.toFixed(1)} A`], ["สนาม B", `${o.B.toExponential(2)} T`], ["มุมเข็มโดยประมาณ", `${o.tipDeg.toFixed(0)}°`]]} controls={<><Slider label="กระแสในสาย" min={-8} max={8} step={0.5} value={I} unit="A" onChange={setI} /><Slider label="ระยะจากสาย" min={0.03} max={0.2} step={0.01} value={r} unit="m" onChange={setR} /><Playback clock={clock} /><p className="hint">กระแสมากหรือใกล้สาย → เข็มเบี่ยงมากขึ้น · สลับขั้วกระแส เข็มกลับทิศ</p></>} note="สายตรงยาว · B = μ₀I/(2πr) · มุมเข็มเป็นสเกลการศึกษา">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
    <line x1="360" y1="40" x2="360" y2="360" stroke="#345e48" strokeWidth="10" />
    <text x="375" y="60">I</text>
    {[1, 2, 3].map((n) => <circle key={n} cx="360" cy="200" r={40 + n * 28} fill="none" stroke="#9aac9b" strokeDasharray="4 5" />)}
    <g transform={`translate(${360 + r * 900},200) rotate(${o.tipDeg + Math.sin(clock.time) * 2})`}>
      <line x1="0" y1="0" x2="0" y2="-36" stroke="#d87951" strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="6" fill="#1c392c" />
    </g>
    <text x="40" y="48">เข็มทิศข้างสาย · ทิศสนามตามมือขวา</text>
  </Frame>;
}
