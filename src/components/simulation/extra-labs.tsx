"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Frame, Slider, Playback, useClock, Arrow } from "./lab-primitives";
import {
  inclineMotion, collide, thinLens, motorSpeed, decayRemaining, enzymeRate, photosynthesisRate,
  mendelCross, predatorPreyPath, reactionRate, equilibriumAB, idealGas, titrationPH,
  brakingDistance, wingLift, torque,
} from "@/simulations/extras";
import { indicatorHue } from "@/simulations/life-science";

function Stage({ children, fill = "#edf3ee" }: { children?: ReactNode; fill?: string }) {
  return <>
    <rect x="10" y="15" width="700" height="350" rx="12" fill={fill} />
    {children}
  </>;
}

function ChartFrame() {
  return <>
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f4f7f1" />
    {[80, 140, 200, 260, 320].map((y) => <line key={y} x1="70" y1={y} x2="650" y2={y} stroke="#e0e7da" />)}
    <line x1="70" y1="320" x2="650" y2="320" stroke="#9aac9b" />
    <line x1="70" y1="40" x2="70" y2="320" stroke="#9aac9b" />
  </>;
}

export function InclineLab() {
  const [angle, setAngle] = useState(30), [mu, setMu] = useState(0.2);
  const clock = useClock(4), m = inclineMotion(angle, mu, clock.time);
  const run = Math.min(520, m.distance * 40);
  const x = 90 + run * Math.cos(m.theta), y = 330 - run * Math.sin(m.theta);
  return <Frame title="ระนาบเอียง: จะไถลหรือนิ่ง?" stats={[["ความเร่ง", `${m.accel.toFixed(2)} m/s²`], ["ระยะทาง", `${m.distance.toFixed(2)} m`], ["สถานะ", m.hold ? "นิ่งเพราะแรงเสียดทาน" : "กำลังไถล"]]} controls={<><Slider label="มุมเอียง" min={5} max={50} value={angle} unit="°" onChange={(v) => { clock.reset(); setAngle(v); }} /><Slider label="สัมประสิทธิ์แรงเสียดทาน μ" min={0} max={1} step={0.05} value={mu} onChange={(v) => { clock.reset(); setMu(v); }} /><Playback clock={clock} /><p className="hint">ถ้า μ ≥ tanθ ก้อนจะยังนิ่ง · ลด μ หรือเพิ่มมุมแล้วเริ่มเวลา</p></>} note="เริ่มนิ่ง · แรงเสียดทานจลน์คงที่เมื่อไถล · ไม่คิดอากาศ">
    <Stage fill="#e8f0e8" />
    <polygon points={`70,330 ${70 + 560 * Math.cos(m.theta)},${330 - 560 * Math.sin(m.theta)} 630,330`} fill="#d7e3d5" />
    <line x1="70" y1="330" x2={70 + 560 * Math.cos(m.theta)} y2={330 - 560 * Math.sin(m.theta)} stroke="#345e48" strokeWidth="8" strokeLinecap="round" />
    <rect x={x - 18} y={y - 30} width="36" height="28" rx="5" fill="#d87951" transform={`rotate(${-angle} ${x} ${y})`} />
    <text x="40" y="48">{m.hold ? "แรงเสียดทานพยุงไว้ได้" : "a = g(sinθ − μ cosθ)"}</text>
    <text x="40" y="360">มุม {angle}° · μ = {mu.toFixed(2)}</text>
  </Frame>;
}

export function CollisionLab() {
  const [m1, setM1] = useState(2), [m2, setM2] = useState(2), [v1, setV1] = useState(4), [v2, setV2] = useState(0), [e, setE] = useState(1);
  const r = collide(m1, v1, m2, v2, e);
  return <Frame title="การชนหนึ่งมิติ: ยืดหยุ่นแค่ไหน?" stats={[["v₁ หลังชน", `${r.v1f.toFixed(2)} m/s`], ["v₂ หลังชน", `${r.v2f.toFixed(2)} m/s`], ["พลังงานจลน์ที่หาย", `${r.lost.toFixed(2)} J`]]} controls={<><Slider label="มวล m₁" min={1} max={8} value={m1} unit="kg" onChange={setM1} /><Slider label="ความเร็วต้น u₁" min={-4} max={8} value={v1} unit="m/s" onChange={setV1} /><Slider label="มวล m₂" min={1} max={8} value={m2} unit="kg" onChange={setM2} /><Slider label="ความเร็วต้น u₂" min={-4} max={8} value={v2} unit="m/s" onChange={setV2} /><Slider label="สัมประสิทธิ์การคืนตัว e" min={0} max={1} step={0.05} value={e} onChange={setE} /><p className="hint">e = 1 ชนยืดหยุ่น · e = 0 ไม่ยืดหยุ่นสุดขีด</p></>} note="การชนตรงศูนย์กลางหนึ่งมิติ · ไม่มีแรงภายนอกแนวชน">
    <Stage />
    <line x1="80" y1="240" x2="640" y2="240" stroke="#b0bdaa" strokeWidth="3" />
    <circle cx="220" cy="210" r={18 + m1 * 3} fill="#345e48" />
    <circle cx="500" cy="210" r={18 + m2 * 3} fill="#d87951" />
    <text x="220" y="218" textAnchor="middle" className="inverse-text">m₁</text>
    <text x="500" y="218" textAnchor="middle" className="inverse-text">m₂</text>
    <Arrow x1={170} y1={120} x2={170 + v1 * 16} y2={120} />
    <Arrow x1={540} y1={120} x2={540 + v2 * 16} y2={120} color="#8a6a4a" />
    <text x="40" y="48">ก่อนชน · ลูกศร = ความเร็วต้น</text>
    <text x="120" y="300" textAnchor="middle">หลัง {r.v1f.toFixed(2)} m/s</text>
    <text x="500" y="300" textAnchor="middle">หลัง {r.v2f.toFixed(2)} m/s</text>
    <text x="40" y="360">K {r.keBefore.toFixed(1)} → {r.keAfter.toFixed(1)} J</text>
  </Frame>;
}

export function LensLab() {
  const [o, setO] = useState(30), [f, setF] = useState(15);
  const L = thinLens(o, f);
  const ox = 360 - o * 4, ix = Number.isFinite(L.imageDistance) ? 360 + Math.max(-280, Math.min(280, L.imageDistance * 4)) : 900;
  const oh = 54, ih = Number.isFinite(L.magnification) ? Math.max(-120, Math.min(120, oh * L.magnification)) : 0;
  return <Frame title="เลนส์บาง: ภาพอยู่ที่ไหน?" stats={[["ระยะภาพ", Number.isFinite(L.imageDistance) ? `${L.imageDistance.toFixed(1)} cm` : "∞"], ["กำลังขยาย", Number.isFinite(L.magnification) ? L.magnification.toFixed(2) : "—"], ["ชนิดภาพ", L.kind === "no-image" ? "ไม่เกิดภาพชัด" : L.real ? "ภาพจริง" : "ภาพเสมือน"]]} controls={<><Slider label="ระยะวัตถุ" min={8} max={60} value={o} unit="cm" onChange={setO} /><Slider label="ความยาวโฟกัส (+ รวมแสง)" min={8} max={30} value={f} unit="cm" onChange={setF} /><p className="hint">เลื่อนวัตถุเข้าใกล้โฟกัส ดูว่าระยะภาพวิ่งไปทางไหน</p></>} note="เลนส์บางในอากาศ · ระยะวัดจากเลนส์">
    <Stage fill="#eef5f1" />
    <line x1="40" y1="200" x2="680" y2="200" stroke="#c5d2c6" />
    <ellipse cx="360" cy="200" rx="10" ry="120" fill="#d7e8dc" stroke="#345e48" strokeWidth="3" />
    <line x1={ox} y1={200} x2={ox} y2={200 - oh} stroke="#d87951" strokeWidth="5" />
    <circle cx={360 - f * 4} cy="200" r="4" fill="#315d47" /><circle cx={360 + f * 4} cy="200" r="4" fill="#315d47" />
    <text x={360 - f * 4} y="185" textAnchor="middle">F</text><text x={360 + f * 4} y="185" textAnchor="middle">F</text>
    {Number.isFinite(L.imageDistance) && <line x1={ix} y1={200} x2={ix} y2={200 - ih} stroke="#216859" strokeWidth="5" />}
    <text x="40" y="48">ส้ม = วัตถุ · เขียว = ภาพ</text>
  </Frame>;
}

export function MotorLab() {
  const [V, setV] = useState(12), [load, setLoad] = useState(1), [field, setField] = useState(1);
  const clock = useClock(), m = motorSpeed(V, load, field), angle = (clock.time * m.omega) % (2 * Math.PI);
  return <Frame title="มอเตอร์ไฟฟ้าอย่างง่าย" stats={[["ความเร็วเชิงมุม", `${m.omega.toFixed(1)} rad/s`], ["รอบต่อนาที", `${m.rpm.toFixed(0)} rpm`], ["กระแส", `${m.current.toFixed(2)} A`]]} controls={<><Slider label="แรงดัน" min={0} max={24} value={V} unit="V" onChange={(v) => { clock.reset(); setV(v); }} /><Slider label="ภาระโหลด" min={0.2} max={4} step={0.2} value={load} onChange={(v) => { clock.reset(); setLoad(v); }} /><Slider label="ความเข้มสนาม (สัมพัทธ์)" min={0.3} max={2} step={0.1} value={field} onChange={(v) => { clock.reset(); setField(v); }} /><Playback clock={clock} /></>} note="แบบจำลองเชิงการศึกษา · แรงบิดและแรงเคลื่อนไฟฟ้าเหนี่ยวนำกลับเป็นสัดส่วนกับสนาม">
    <Stage fill="#eef3ee" />
    <circle cx="360" cy="200" r="110" fill="#e2ebe3" stroke="#9aac9b" strokeWidth="10" />
    <circle cx="360" cy="200" r="18" fill="#315d47" />
    <line x1="360" y1="200" x2={360 + 78 * Math.cos(angle)} y2={200 + 78 * Math.sin(angle)} stroke="#d87951" strokeWidth="10" strokeLinecap="round" />
    <text x="40" y="48">เพิ่มโหลด → ช้าลง · เพิ่มแรงดัน → เร็วขึ้น</text>
    <text x="40" y="360">แรงบิดประมาณ {m.torque.toFixed(2)} N·m</text>
  </Frame>;
}

export function HalfLifeLab() {
  const [n0, setN0] = useState(1000), [half, setHalf] = useState(2);
  const clock = useClock(12), d = decayRemaining(n0, half, clock.time);
  const pts = Array.from({ length: 121 }, (_, i) => {
    const t = i / 10, y = decayRemaining(n0, half, t).remaining;
    return `${70 + t * 48},${320 - y * (240 / n0)}`;
  }).join(" ");
  return <Frame title="ครึ่งชีวิต: เหลือเท่าไรเมื่อเวลาผ่านไป?" stats={[["นิวไคลด์ที่เหลือ", `${d.remaining.toFixed(1)}`], ["เศษส่วนที่เหลือ", `${(d.fraction * 100).toFixed(1)} %`], ["จำนวนครึ่งชีวิต", `${d.elapsedHalves.toFixed(2)}`]]} controls={<><Slider label="จำนวนเริ่มต้น N₀" min={200} max={2000} step={100} value={n0} unit="ตัว" onChange={(v) => { clock.reset(); setN0(v); }} /><Slider label="ครึ่งชีวิต" min={0.5} max={5} step={0.5} value={half} unit="s" onChange={(v) => { clock.reset(); setHalf(v); }} /><Playback clock={clock} /></>} note="การสลายเชิงสุ่มแบบต่อเนื่อง · ไม่ระบุนิวไคลด์จริง">
    <ChartFrame />
    <polyline points={pts} fill="none" stroke="#345e48" strokeWidth="3" />
    <circle cx={70 + clock.time * 48} cy={320 - d.remaining * (240 / n0)} r="7" fill="#d87951" />
    <text x="40" y="48">ทุกครึ่งชีวิต ปริมาณเหลือประมาณครึ่งหนึ่งของช่วงก่อนหน้า</text>
  </Frame>;
}

export function EnzymeLab() {
  const [S, setS] = useState(5), [temp, setTemp] = useState(37), [pH, setPH] = useState(7);
  const r = enzymeRate(S, 2, temp, pH);
  const curve = Array.from({ length: 41 }, (_, i) => {
    const t = 10 + i * 1.5, y = enzymeRate(S, 2, t, pH).rate;
    return `${90 + i * 13},${300 - y * 180}`;
  }).join(" ");
  return <Frame title="เอนไซม์: อุณหภูมิกับ pH กระทบอัตราอย่างไร?" stats={[["อัตราสัมพัทธ์", r.rate.toFixed(2)], ["ปัจจัยอุณหภูมิ", r.tempFactor.toFixed(2)], ["ปัจจัย pH", r.pHFactor.toFixed(2)]]} controls={<><Slider label="ความเข้มข้นซับสเตรต" min={0.2} max={12} step={0.2} value={S} unit="หน่วย" onChange={setS} /><Slider label="อุณหภูมิ" min={10} max={70} value={temp} unit="°C" onChange={setTemp} /><Slider label="pH" min={3} max={11} step={0.5} value={pH} onChange={setPH} /><p className="hint">ลอง 37 °C แล้วเพิ่มเกิน 55 °C · อัตราจะตกเพราะโครงร่างเอนไซม์เสีย</p></>} note="Michaelis–Menten × เส้นโค้งอุณหภูมิ/pH เชิงการศึกษา">
    <ChartFrame />
    <polyline points={curve} fill="none" stroke="#6f9a78" strokeWidth="3" />
    <circle cx={90 + ((temp - 10) / 1.5) * 13} cy={300 - r.rate * 180} r="7" fill="#d87951" />
    <text x="40" y="48">เส้นโค้งตามอุณหภูมิที่ซับสเตรตและ pH ปัจจุบัน</text>
  </Frame>;
}

export function PhotosynthesisLab() {
  const [light, setLight] = useState(400), [co2, setCo2] = useState(400), [temp, setTemp] = useState(25);
  const r = photosynthesisRate(light, co2, temp);
  return <Frame title="สังเคราะห์แสงอย่างง่าย" stats={[["อัตราสัมพัทธ์", `${r.rate.toFixed(1)} %`], ["จำกัดด้วยแสง", `${(r.lightTerm * 100).toFixed(0)} %`], ["จำกัดด้วย CO₂", `${(r.co2Term * 100).toFixed(0)} %`]]} controls={<><Slider label="ความเข้มแสง" min={0} max={1200} step={50} value={light} unit="หน่วย" onChange={setLight} /><Slider label="CO₂" min={50} max={1000} step={50} value={co2} unit="ppm" onChange={setCo2} /><Slider label="อุณหภูมิ" min={5} max={45} value={temp} unit="°C" onChange={setTemp} /><p className="hint">เพิ่มแสงจนอิ่มตัว แล้วลองเพิ่ม CO₂ แทน</p></>} note="เส้นโค้งอิ่มตัวเชิงการศึกษา · ไม่จำลองวัฏจักรเต็ม">
    <Stage fill="#e7f0e4" />
    <circle cx="520" cy="90" r="36" fill="#f0d48a" opacity="0.85" />
    <path d="M180 280C220 180 280 140 360 160C420 176 460 220 480 280Z" fill="#6f9a78" />
    <line x1="360" y1="280" x2="360" y2="330" stroke="#345e48" strokeWidth="8" />
    <circle cx="360" cy="200" r={16 + r.rate * 0.22} fill="#dfe9d8" stroke="#315d47" strokeWidth="3" />
    <text x="360" y="206" textAnchor="middle">{r.rate.toFixed(0)}%</text>
    <text x="40" y="48">แสงและ CO₂ ต่างก็เป็นปัจจัยจำกัดได้</text>
  </Frame>;
}

export function MendelLab() {
  const [p1, setP1] = useState<"AA" | "Aa" | "aa">("Aa"), [p2, setP2] = useState<"AA" | "Aa" | "aa">("Aa");
  const m = mendelCross(p1, p2);
  const opts = ["AA", "Aa", "aa"] as const;
  return <Frame title="พันธุศาสตร์เมนเดล: ลูกได้อะไรบ้าง?" stats={[["ฟีโนไทป์เด่น", `${(m.phenotypeDominant * 100).toFixed(0)} %`], ["ฟีโนไทป์ด้อย", `${(m.phenotypeRecessive * 100).toFixed(0)} %`], ["Aa", `${(m.Aa * 100).toFixed(0)} %`]]} controls={<>
    <label htmlFor="mendel-p1">พ่อ/แม่ 1</label><select id="mendel-p1" value={p1} onChange={(e) => setP1(e.target.value as typeof p1)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
    <label htmlFor="mendel-p2">พ่อ/แม่ 2</label><select id="mendel-p2" value={p2} onChange={(e) => setP2(e.target.value as typeof p2)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
    <p className="hint">Aa × Aa ควรได้เด่น:ด้อย ≈ 3:1</p>
  </>} note="ยีนเดียว สองแอลลีล เด่นสมบูรณ์">
    <Stage />
    {([["AA", m.AA], ["Aa", m.Aa], ["aa", m.aa]] as const).map(([label, p], i) =>
      <g key={label}>
        <rect x={90 + i * 180} y={280 - p * 200} width="120" height={p * 200} rx="8" fill={label === "aa" ? "#d87951" : "#6f9a78"} />
        <text x={150 + i * 180} y="320" textAnchor="middle">{label} {(p * 100).toFixed(0)}%</text>
      </g>)}
    <text x="40" y="48">สัดส่วนจีโนไทป์ของลูก</text>
  </Frame>;
}

export function PredatorPreyLab() {
  const [prey, setPrey] = useState(10), [pred, setPred] = useState(5);
  const path = useMemo(() => predatorPreyPath(prey, pred), [prey, pred]);
  const clock = useClock((path.length - 1) / 50), idx = Math.min(path.length - 1, Math.floor(clock.time * 50)), p = path[idx];
  const preyLine = path.filter((_, i) => i % 4 === 0).map((pt) => `${70 + pt.t * 32},${320 - pt.prey * 8}`).join(" ");
  const predLine = path.filter((_, i) => i % 4 === 0).map((pt) => `${70 + pt.t * 32},${320 - pt.predator * 8}`).join(" ");
  return <Frame title="เหยื่อ–ผู้ล่า: จำนวนขึ้นลงสลับกัน" stats={[["เหยื่อ", p.prey.toFixed(1)], ["ผู้ล่า", p.predator.toFixed(1)], ["เวลา", `${p.t.toFixed(1)}`]]} controls={<><Slider label="เหยื่อเริ่มต้น" min={2} max={20} value={prey} onChange={(v) => { clock.reset(); setPrey(v); }} /><Slider label="ผู้ล่าเริ่มต้น" min={1} max={12} value={pred} onChange={(v) => { clock.reset(); setPred(v); }} /><Playback clock={clock} /></>} note="Lotka–Volterra อย่างง่าย">
    <ChartFrame />
    <polyline points={preyLine} fill="none" stroke="#6f9a78" strokeWidth="3" />
    <polyline points={predLine} fill="none" stroke="#d87951" strokeWidth="3" />
    <circle cx={70 + p.t * 32} cy={320 - p.prey * 8} r="5" fill="#345e48" />
    <circle cx={70 + p.t * 32} cy={320 - p.predator * 8} r="5" fill="#b56845" />
    <text x="40" y="48">เขียว = เหยื่อ · ส้ม = ผู้ล่า</text>
  </Frame>;
}

export function ReactionRateLab() {
  const [C, setC] = useState(1), [T, setT] = useState(300), [order, setOrder] = useState(1);
  const r = reactionRate(C, T, order);
  const h = Math.min(220, r.rate * 40);
  return <Frame title="อัตราปฏิกิริยา: อุณหภูมิกับความเข้มข้น" stats={[["อัตรา", r.rate.toFixed(3)], ["ค่าคงที่ k", r.k.toFixed(3)], ["อันดับปฏิกิริยา", `${order}`]]} controls={<><Slider label="ความเข้มข้น" min={0.2} max={3} step={0.1} value={C} unit="mol/L" onChange={setC} /><Slider label="อุณหภูมิ" min={250} max={400} step={5} value={T} unit="K" onChange={setT} /><Slider label="อันดับ n ใน rate = k[A]^n" min={0} max={2} step={1} value={order} onChange={setOrder} /><p className="hint">อุณหภูมิสูงขึ้น k โตแบบเอกซ์โพเนนเชียล</p></>} note="Arrhenius อย่างง่าย · Ea คงที่">
    <Stage />
    <rect x="160" y={300 - h} width="160" height={h} rx="8" fill="#da7954" />
    <text x="240" y="330" textAnchor="middle">อัตรา</text>
    <text x="380" y="120">rate = k[A]^n</text>
    <text x="380" y="150">k ∝ e^(-Ea/T)</text>
  </Frame>;
}

export function EquilibriumLab() {
  const [total, setTotal] = useState(2), [K, setK] = useState(1);
  const eq = equilibriumAB(total, K);
  return <Frame title="สมดุล A ⇌ B: K เปลี่ยนสัดส่วนอย่างไร?" stats={[["[A]", eq.A.toFixed(2)], ["[B]", eq.B.toFixed(2)], ["[B]/[A]", eq.ratio.toFixed(2)]]} controls={<><Slider label="ความเข้มข้นรวม" min={0.5} max={4} step={0.1} value={total} unit="mol/L" onChange={setTotal} /><Slider label="ค่าคงที่สมดุล K" min={0.1} max={10} step={0.1} value={K} onChange={setK} /><p className="hint">เพิ่ม K ระบบเอียงไปทางผลิตภัณฑ์ B</p></>} note="ปฏิกิริยาเดียว A ⇌ B · K = [B]/[A]">
    <Stage />
    <rect x="120" y={280 - eq.A * 40} width="160" height={eq.A * 40} rx="8" fill="#6f9a78" />
    <rect x="420" y={280 - eq.B * 40} width="160" height={eq.B * 40} rx="8" fill="#d87951" />
    <text x="200" y="320" textAnchor="middle">A</text>
    <text x="500" y="320" textAnchor="middle">B</text>
    <text x="360" y="200" textAnchor="middle" className="big-symbol">⇌</text>
  </Frame>;
}

export function IdealGasLab() {
  const [n, setN] = useState(1), [T, setT] = useState(300), [V, setV] = useState(22.4);
  const g = idealGas(n, T, V);
  const side = Math.sqrt(V) * 14;
  return <Frame title="แก๊สในอุดมคติ: PV = nRT" stats={[["ความดัน", `${g.pressure.toFixed(2)} atm`], ["อุณหภูมิ", `${T} K`], ["ปริมาตร", `${V.toFixed(1)} L`]]} controls={<><Slider label="จำนวนโมล n" min={0.2} max={3} step={0.1} value={n} unit="mol" onChange={setN} /><Slider label="อุณหภูมิ" min={200} max={500} step={10} value={T} unit="K" onChange={setT} /><Slider label="ปริมาตร" min={5} max={40} step={0.5} value={V} unit="L" onChange={setV} /><p className="hint">ลดปริมาตรโดยคง n,T · ความดันต้องขึ้น</p></>} note="แก๊สในอุดมคติ · R = 0.082057 L·atm/(mol·K)">
    <Stage fill="#eef4f2" />
    <rect x={360 - side / 2} y={210 - side / 2} width={side} height={side} rx="12" fill="#dceeea" stroke="#345e48" strokeWidth="3" />
    {Array.from({ length: Math.round(n * 8) }, (_, i) =>
      <circle key={i} cx={360 - side * 0.3 + ((i * 47) % (side * 0.6))} cy={210 - side * 0.3 + ((i * 31) % (side * 0.6))} r="4" fill="#d87951" />)}
    <text x="40" y="48">P = nRT / V = {g.pressure.toFixed(2)} atm</text>
  </Frame>;
}

export function TitrationLab() {
  const [baseMl, setBaseMl] = useState(0);
  const t = titrationPH(0.1, 0.025, 0.1, baseMl / 1000);
  const curve = Array.from({ length: 51 }, (_, i) => {
    const ml = i, p = titrationPH(0.1, 0.025, 0.1, ml / 1000).pH;
    return `${80 + ml * 9},${320 - p * 18}`;
  }).join(" ");
  return <Frame title="ไทเทรตกรดแก่ด้วยเบสแก่" stats={[["pH", t.pH.toFixed(2)], ["เบสที่เติม", `${baseMl} mL`], ["จุดสมมูล", `${(t.equivalenceL * 1000).toFixed(0)} mL`]]} controls={<><Slider label="ปริมาตรเบสที่เติม" min={0} max={50} value={baseMl} unit="mL" onChange={setBaseMl} /><p className="hint">กรด 0.1 M 25 mL · เลื่อนใกล้ 25 mL แล้วดู pH พุ่ง</p></>} note="กรดแก่–เบสแก่ · ไม่มีบัฟเฟอร์">
    <ChartFrame />
    <polyline points={curve} fill="none" stroke="#345e48" strokeWidth="3" />
    <circle cx={80 + baseMl * 9} cy={320 - t.pH * 18} r="7" fill="#d87951" />
    <rect x="560" y="70" width="110" height="220" rx="10" fill={`hsl(${indicatorHue(t.pH)} 55% 70%)`} stroke="#9aac9b" strokeWidth="2" />
    <text x="615" y="320" textAnchor="middle">pH {t.pH.toFixed(1)}</text>
  </Frame>;
}

export function BrakingLab() {
  const [speed, setSpeed] = useState(20), [mu, setMu] = useState(0.7), [react, setReact] = useState(1);
  const b = brakingDistance(speed, mu, react);
  const reactW = Math.min(240, b.reaction * 8), brakeW = Math.min(280, b.braking * 8);
  return <Frame title="เบรกแล้วหยุดไกลแค่ไหน?" stats={[["ระยะคิดตัว", `${b.reaction.toFixed(1)} m`], ["ระยะเบรก", `${b.braking.toFixed(1)} m`], ["รวม", `${b.total.toFixed(1)} m`]]} controls={<><Slider label="ความเร็วต้น" min={5} max={40} value={speed} unit="m/s" onChange={setSpeed} /><Slider label="μ ของถนน" min={0.2} max={1} step={0.05} value={mu} onChange={setMu} /><Slider label="เวลาปฏิกิริยา" min={0.4} max={2} step={0.1} value={react} unit="s" onChange={setReact} /><p className="hint">เพิ่มความเร็วสองเท่า · ระยะเบรกโตประมาณสี่เท่า</p></>} note="ถนนราบ · แรงเสียดทานคงที่">
    <Stage fill="#e9eee6" />
    <rect x="40" y="250" width="640" height="40" fill="#cfd9cb" />
    <rect x="70" y="220" width="56" height="30" rx="5" fill="#345e48" />
    <rect x={126 + reactW + brakeW} y="228" width="36" height="22" rx="4" fill="#d87951" />
    <rect x="126" y="188" width={reactW} height="10" rx="4" fill="#8a6a4a" />
    <rect x={126 + reactW} y="188" width={brakeW} height="10" rx="4" fill="#da7954" />
    <text x="40" y="48">น้ำตาล = คิดตัว · ส้ม = เบรก</text>
    <text x="40" y="360">รวม {b.total.toFixed(1)} m</text>
  </Frame>;
}

export function LiftLab() {
  const [speed, setSpeed] = useState(60), [area, setArea] = useState(20), [cl, setCl] = useState(0.8), [mass, setMass] = useState(800);
  const L = wingLift(speed, area, cl, mass);
  return <Frame title="แรงยกของปีก: บินขึ้นได้ไหม?" stats={[["แรงยก", `${L.lift.toFixed(0)} N`], ["น้ำหนัก", `${L.weight.toFixed(0)} N`], ["สถานะ", L.flies ? "แรงยกพอ · ลอยได้" : "แรงยกไม่พอ"]]} controls={<><Slider label="ความเร็วอากาศ" min={20} max={120} value={speed} unit="m/s" onChange={setSpeed} /><Slider label="พื้นที่ปีก" min={5} max={40} value={area} unit="m²" onChange={setArea} /><Slider label="สัมประสิทธิ์แรงยก C_L" min={0.2} max={1.6} step={0.1} value={cl} onChange={setCl} /><Slider label="มวล" min={300} max={2000} step={50} value={mass} unit="kg" onChange={setMass} /></>} note="L = ½ρv²AC_L · ρ = 1.225 kg/m³">
    <Stage fill="#e7eef5" />
    <path d="M120 230C210 170 330 150 520 180C580 192 620 210 640 235" fill="none" stroke="#345e48" strokeWidth="10" strokeLinecap="round" />
    <Arrow x1={340} y1={210} x2={340} y2={210 - Math.min(130, L.lift / 90)} color="#216859" />
    <Arrow x1={420} y1={210} x2={420} y2={210 + Math.min(130, L.weight / 90)} />
    <text x="40" y="48">{L.flies ? "แรงยก ≥ น้ำหนัก" : "ต้องเร็วขึ้น หรือปีกใหญ่ขึ้น"}</text>
    <text x="300" y="70">ยก</text><text x="400" y="350">หนัก</text>
  </Frame>;
}

export function TorqueLab() {
  const [F, setF] = useState(40), [r, setR] = useState(0.8), [angle, setAngle] = useState(90);
  const t = torque(F, r, angle);
  const hx = 360 + r * 180, hy = 220;
  const fx = hx + Math.cos((angle * Math.PI) / 180) * 70, fy = hy - Math.sin((angle * Math.PI) / 180) * 70;
  return <Frame title="โมเมนต์แรง: ผลักประตูตรงไหนดี?" stats={[["แรงบิด", `${t.tau.toFixed(1)} N·m`], ["แขนแรง", `${t.lever.toFixed(2)} m`], ["มุม", `${angle}°`]]} controls={<><Slider label="แรง" min={5} max={100} value={F} unit="N" onChange={setF} /><Slider label="ระยะจากบานพับ" min={0.2} max={1.2} step={0.05} value={r} unit="m" onChange={setR} /><Slider label="มุมระหว่างแรงกับประตู" min={10} max={90} value={angle} unit="°" onChange={setAngle} /><p className="hint">ผลักไกลบานพับและตั้งฉากกับบานประตูได้แรงบิดมากที่สุด</p></>} note="τ = rF sinθ">
    <Stage />
    <rect x="348" y="70" width="24" height="280" rx="4" fill="#9aac9b" />
    <line x1="360" y1="220" x2={hx} y2={hy} stroke="#345e48" strokeWidth="14" strokeLinecap="round" />
    <Arrow x1={hx} y1={hy} x2={fx} y2={fy} />
    <circle cx="360" cy="220" r="7" fill="#183d30" />
    <text x="40" y="48">บานพับซ้าย · ลูกศรคือแรง</text>
  </Frame>;
}
