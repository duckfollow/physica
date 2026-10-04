"use client";
import { useState } from "react";
import { Frame, Slider } from "./lab-primitives";
import {
  linearValue, linearRoot, quadraticValue, quadraticVertex, quadraticRoots, quadraticDiscriminant,
  rightTriangle, coinProbability, dieProbability, areaUnderQuadratic,
  exponentialValue, exponentialGrowth, absoluteValue, absoluteVertex,
  reciprocalValue, reciprocalAsymptotes, sampleGraph,
} from "@/simulations/math";

const ox = 360, oy = 220, sx = 28, sy = 22;

function PlotStage() {
  return <>
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3f6f8" />
    {[-8, -4, 0, 4, 8].map((x) => <line key={`v${x}`} x1={ox + x * sx} y1="40" x2={ox + x * sx} y2="360" stroke="#e4ebf0" />)}
    {[-6, -3, 0, 3, 6].map((y) => <line key={`h${y}`} x1="80" y1={oy - y * sy} x2="640" y2={oy - y * sy} stroke="#e4ebf0" />)}
    <line x1="80" y1={oy} x2="640" y2={oy} stroke="#9aafb8" strokeWidth="1.5" />
    <line x1={ox} y1="40" x2={ox} y2="360" stroke="#9aafb8" strokeWidth="1.5" />
    <text x="620" y={oy - 10}>x</text>
    <text x={ox + 10} y="55">y</text>
  </>;
}

export function LinearLab() {
  const [m, setM] = useState(1), [c, setC] = useState(0);
  const root = linearRoot(m, c);
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = -10 + i / 2;
    return `${ox + x * sx},${oy - linearValue(m, c, x) * sy}`;
  }).join(" ");
  return <Frame title="เส้นตรง: ความชันกับจุดตัดแกน y" stats={[["ความชัน m", m.toFixed(1)], ["จุดตัดแกน y", c.toFixed(1)], ["ตัดแกน x", root === null ? "ไม่มี" : !Number.isFinite(root) ? "ทั้งเส้น" : root.toFixed(2)]]} controls={<><Slider label="ความชัน m" min={-3} max={3} step={0.1} value={m} onChange={setM} /><Slider label="จุดตัดแกน y (c)" min={-6} max={6} step={0.5} value={c} onChange={setC} /><p className="hint">เพิ่ม m เส้นชันขึ้น · เปลี่ยน c เส้นเลื่อนขึ้น–ลงโดยไม่เปลี่ยนความชัน</p></>} note="กราฟ y = mx + c ในระนาบพิกัด · สเกลแกนคงที่">
    <PlotStage />
    <polyline points={pts} fill="none" stroke="#345e48" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx={ox} cy={oy - c * sy} r="6" fill="#d87951" />
    <text x="40" y="48">y = {m.toFixed(1)}x + {c.toFixed(1)}</text>
  </Frame>;
}

export function QuadraticLab() {
  const [a, setA] = useState(0.5), [b, setB] = useState(0), [c, setC] = useState(-2);
  const v = quadraticVertex(a, b, c), roots = quadraticRoots(a, b, c), d = quadraticDiscriminant(a, b, c);
  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = -8 + i * 16 / 60;
    return `${ox + x * sx},${oy - quadraticValue(a, b, c, x) * sy}`;
  }).join(" ");
  return <Frame title="พาราโบลา: จุดยอดและราก" stats={[["จุดยอด x", v.x.toFixed(2)], ["จุดยอด y", v.y.toFixed(2)], ["จำนวนรากจริง", `${roots.length}`]]} controls={<><Slider label="a ใน ax²" min={-2} max={2} step={0.1} value={a} onChange={setA} /><Slider label="b ใน bx" min={-4} max={4} step={0.1} value={b} onChange={setB} /><Slider label="c" min={-6} max={6} step={0.5} value={c} onChange={setC} /><p className="hint">a บวกเปิดขึ้น · a ลบเปิดลง · ค่า D = {d.toFixed(2)}</p></>} note="y = ax² + bx + c · รากคือจุดที่กราฟตัดแกน x">
    <PlotStage />
    <polyline points={pts} fill="none" stroke="#345e48" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx={ox + v.x * sx} cy={oy - v.y * sy} r="6" fill="#d87951" />
    {roots.map((r) => <circle key={r} cx={ox + r * sx} cy={oy} r="5" fill="#216859" />)}
    <text x="40" y="48">y = {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)}</text>
  </Frame>;
}

export function TrigonometryLab() {
  const [angle, setAngle] = useState(35), [hyp, setHyp] = useState(8);
  const t = rightTriangle(angle, hyp);
  const scale = 28, x0 = 170, y0 = 310;
  return <Frame title="ตรีโกณในสามเหลี่ยมมุมฉาก" stats={[["sin θ", t.sin.toFixed(3)], ["cos θ", t.cos.toFixed(3)], ["tan θ", t.tan.toFixed(3)]]} controls={<><Slider label="มุม θ" min={5} max={80} value={angle} unit="°" onChange={setAngle} /><Slider label="ด้านตรงข้ามมุมฉาก" min={4} max={12} step={0.5} value={hyp} unit="หน่วย" onChange={setHyp} /><p className="hint">sin = ข้าม/ฉาก · cos = ชิด/ฉาก · tan = ข้าม/ชิด</p></>} note="มุมฉากคงที่ · θ คือมุมที่จุดซ้ายล่าง">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3f6f8" />
    <polygon points={`${x0},${y0} ${x0 + t.adjacent * scale},${y0} ${x0 + t.adjacent * scale},${y0 - t.opposite * scale}`} fill="#dfe9e8" stroke="#345e48" strokeWidth="3" />
    <rect x={x0} y={y0 - 18} width="18" height="18" fill="none" stroke="#8a6a4a" strokeWidth="2" />
    <text x={x0 + t.adjacent * scale / 2} y={y0 + 24} textAnchor="middle">ชิด {t.adjacent.toFixed(1)}</text>
    <text x={x0 + t.adjacent * scale + 14} y={y0 - t.opposite * scale / 2}>ข้าม {t.opposite.toFixed(1)}</text>
    <text x={x0 + t.adjacent * scale / 2 - 8} y={y0 - t.opposite * scale / 2 - 12}>ฉาก {hyp.toFixed(1)}</text>
    <text x={x0 + 20} y={y0 - 14}>θ = {angle}°</text>
    <text x="420" y="80">sin = {(t.sin).toFixed(3)}</text>
    <text x="420" y="110">cos = {(t.cos).toFixed(3)}</text>
    <text x="420" y="140">tan = {(t.tan).toFixed(3)}</text>
  </Frame>;
}

export function ProbabilityLab() {
  const [flips, setFlips] = useState(4), [heads, setHeads] = useState(2), [faces, setFaces] = useState(6), [target, setTarget] = useState(3);
  const coin = coinProbability(heads, flips), die = dieProbability(faces, target);
  return <Frame title="ความน่าจะเป็น: เหรียญและลูกเต๋า" stats={[["P(เหรียญหัวตรงจำนวน)", `${(coin.p * 100).toFixed(1)} %`], ["ค่าคาดหมายหัว", coin.expectedHeads.toFixed(1)], ["P(ลูกเต๋าได้เป้า)", `${(die.p * 100).toFixed(1)} %`]]} controls={<><Slider label="จำนวนครั้งโยนเหรียญ" min={1} max={10} value={flips} onChange={(v) => { setFlips(v); setHeads(Math.min(heads, v)); }} /><Slider label="ต้องการหัวกี่ครั้ง" min={0} max={flips} value={Math.min(heads, flips)} onChange={setHeads} /><Slider label="จำนวนหน้าลูกเต๋า" min={2} max={12} value={faces} onChange={setFaces} /><Slider label="หน้าเป้าหมาย" min={1} max={faces} value={Math.min(target, faces)} onChange={setTarget} /><p className="hint">เหรียญยุติธรรม · ลูกเต๋ายุติธรรมแต่ละหน้าโอกาสเท่ากัน</p></>} note="การทดลองอิสระ · ไม่จำลองลำดับผลลัพธ์จริง">
    <rect x="10" y="15" width="700" height="350" rx="12" fill="#f3f6f8" />
    <rect x="100" y={280 - coin.p * 200} width="150" height={coin.p * 200} rx="8" fill="#6f9a78" />
    <rect x="380" y={280 - die.p * 200} width="150" height={die.p * 200} rx="8" fill="#d87951" />
    <text x="175" y="320" textAnchor="middle">เหรียญ</text>
    <text x="455" y="320" textAnchor="middle">ลูกเต๋า</text>
    <text x="40" y="48">P(หัว {Math.min(heads, flips)} จาก {flips}) = {(coin.p * 100).toFixed(1)}%</text>
    <text x="40" y="78">P(ได้ {Math.min(target, faces)}) = {(die.p * 100).toFixed(1)}%</text>
  </Frame>;
}

export function ExponentialLab() {
  const [a, setA] = useState(1), [base, setBase] = useState(1.5);
  const kind = exponentialGrowth(base);
  const label = kind === "growth" ? "เติบโต" : kind === "decay" ? "สลาย" : "คงที่";
  const segments = sampleGraph((x) => exponentialValue(a, base, x), -6, 6, 100, 12);
  const y1 = exponentialValue(a, base, 1);
  return <Frame title="กราฟเอกซ์โพเนนเชียล: y = a·bˣ" stats={[["ค่าที่ x = 0", a.toFixed(2)], ["ค่าที่ x = 1", y1.toFixed(2)], ["ลักษณะ", label]]} controls={<><Slider label="ค่า a (จุดตัดแกน y)" min={0.2} max={3} step={0.1} value={a} onChange={setA} /><Slider label="ฐาน b" min={0.3} max={2.5} step={0.05} value={base} onChange={setBase} /><p className="hint">b &gt; 1 เติบโต · 0 &lt; b &lt; 1 สลาย · ที่ x = 0 ได้ y = a เสมอ</p></>} note="ฐาน b &gt; 0 · สเกลแกนคงที่ · ค่า y ที่สูง/ต่ำมากถูกตัดขอบภาพ">
    <PlotStage />
    {segments.map((seg, i) => <polyline key={i} points={seg.map((p) => `${ox + p.x * sx},${oy - p.y * sy}`).join(" ")} fill="none" stroke="#345e48" strokeWidth="3.5" strokeLinecap="round" />)}
    <circle cx={ox} cy={oy - a * sy} r="6" fill="#d87951" />
    <text x="40" y="48">y = {a.toFixed(1)} · {base.toFixed(2)}ˣ</text>
  </Frame>;
}

export function AbsoluteLab() {
  const [a, setA] = useState(1), [h, setH] = useState(0), [k, setK] = useState(0);
  const v = absoluteVertex(h, k);
  const segments = sampleGraph((x) => absoluteValue(a, h, k, x), -10, 10, 100, 12);
  return <Frame title="กราฟค่าสัมบูรณ์: y = a|x − h| + k" stats={[["จุดยอด", `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`], ["ความชันแขน", Math.abs(a).toFixed(1)], ["เปิด", a >= 0 ? "ขึ้นรูป V" : "ลงรูป Λ"]]} controls={<><Slider label="a (ความชันแขน)" min={-3} max={3} step={0.1} value={a} onChange={setA} /><Slider label="h (เลื่อนแนวนอน)" min={-5} max={5} step={0.5} value={h} onChange={setH} /><Slider label="k (เลื่อนแนวตั้ง)" min={-5} max={5} step={0.5} value={k} onChange={setK} /><p className="hint">จุดยอดอยู่ที่ (h, k) · |a| ใหญ่ทำให้ V แคบและชัน</p></>} note="กราฟสองเส้นตรงประกบกันที่จุดยอด · สเกลแกนคงที่">
    <PlotStage />
    {segments.map((seg, i) => <polyline key={i} points={seg.map((p) => `${ox + p.x * sx},${oy - p.y * sy}`).join(" ")} fill="none" stroke="#345e48" strokeWidth="3.5" strokeLinecap="round" />)}
    <circle cx={ox + v.x * sx} cy={oy - v.y * sy} r="6" fill="#d87951" />
    <text x="40" y="48">y = {a.toFixed(1)}|x − {h.toFixed(1)}| + {k.toFixed(1)}</text>
  </Frame>;
}

export function ReciprocalLab() {
  const [a, setA] = useState(2), [h, setH] = useState(0), [k, setK] = useState(0);
  const asym = reciprocalAsymptotes(h, k);
  const segments = sampleGraph((x) => reciprocalValue(a, h, k, x), -10, 10, 160, 12);
  return <Frame title="กราฟส่วนกลับ: y = a/(x − h) + k" stats={[["เส้นกำกับแนวตั้ง", `x = ${asym.vertical.toFixed(1)}`], ["เส้นกำกับแนวนอน", `y = ${asym.horizontal.toFixed(1)}`], ["สาขา", a >= 0 ? "ควอดแรนต์ I–III แบบเลื่อน" : "ควอดแรนต์ II–IV แบบเลื่อน"]]} controls={<><Slider label="a" min={-4} max={4} step={0.2} value={a} onChange={setA} /><Slider label="h (เลื่อนแนวนอน)" min={-4} max={4} step={0.5} value={h} onChange={setH} /><Slider label="k (เลื่อนแนวตั้ง)" min={-4} max={4} step={0.5} value={k} onChange={setK} /><p className="hint">กราฟไม่ข้ามเส้นกำกับ · ใกล้ x = h ค่า y พุ่งสูงหรือต่ำมาก</p></>} note="ไม่นิยามที่ x = h · สเกลแกนคงที่ · ส่วนที่ |y| ใหญ่ถูกตัดขอบภาพ">
    <PlotStage />
    <line x1={ox + asym.vertical * sx} y1="40" x2={ox + asym.vertical * sx} y2="360" stroke="#b56845" strokeDasharray="5 5" />
    <line x1="80" y1={oy - asym.horizontal * sy} x2="640" y2={oy - asym.horizontal * sy} stroke="#b56845" strokeDasharray="5 5" />
    {segments.map((seg, i) => <polyline key={i} points={seg.map((p) => `${ox + p.x * sx},${oy - p.y * sy}`).join(" ")} fill="none" stroke="#345e48" strokeWidth="3.5" strokeLinecap="round" />)}
    <text x="40" y="48">y = {a.toFixed(1)}/(x − {h.toFixed(1)}) + {k.toFixed(1)}</text>
  </Frame>;
}

export function AreaLab() {
  const [a, setA] = useState(0.15), [b, setB] = useState(0), [c, setC] = useState(2), [left, setLeft] = useState(-2), [right, setRight] = useState(4);
  const area = areaUnderQuadratic(a, b, c, left, right);
  const curve = Array.from({ length: 81 }, (_, i) => {
    const x = -8 + i / 5;
    return `${ox + x * sx},${oy - quadraticValue(a, b, c, x) * sy}`;
  }).join(" ");
  const shade = Array.from({ length: 41 }, (_, i) => {
    const x = left + i * (right - left) / 40;
    return `${ox + x * sx},${oy - quadraticValue(a, b, c, x) * sy}`;
  });
  const shadePoly = [`${ox + left * sx},${oy}`, ...shade, `${ox + right * sx},${oy}`].join(" ");
  return <Frame title="พื้นที่ใต้กราฟพาราโบลา" stats={[["พื้นที่โดยประมาณ", area.approx.toFixed(2)], ["ค่าแม่นยำ", area.exact.toFixed(2)], ["ความกว้างช่วง", area.width.toFixed(1)]]} controls={<><Slider label="a" min={-0.5} max={0.5} step={0.05} value={a} onChange={setA} /><Slider label="b" min={-2} max={2} step={0.1} value={b} onChange={setB} /><Slider label="c" min={-2} max={5} step={0.5} value={c} onChange={setC} /><Slider label="ขอบซ้าย" min={-6} max={5} step={0.5} value={left} onChange={(v) => setLeft(Math.min(v, right - 0.5))} /><Slider label="ขอบขวา" min={-5} max={6} step={0.5} value={right} onChange={(v) => setRight(Math.max(v, left + 0.5))} /><p className="hint">พื้นที่แรเงาคืออินทิกรัลของ y = ax²+bx+c จากซ้ายถึงขวา</p></>} note="ใช้กฎสี่เหลี่ยมคางหมูประมาณ และเทียบกับปฏิยานุพันธ์แม่นยำ">
    <PlotStage />
    <polygon points={shadePoly} fill="#efd2b9" opacity="0.9" />
    <polyline points={curve} fill="none" stroke="#345e48" strokeWidth="3.5" />
    <line x1={ox + left * sx} y1="40" x2={ox + left * sx} y2="360" stroke="#b56845" strokeDasharray="4 4" />
    <line x1={ox + right * sx} y1="40" x2={ox + right * sx} y2="360" stroke="#b56845" strokeDasharray="4 4" />
    <text x="40" y="48">∫ y dx ≈ {area.approx.toFixed(2)} · แม่นยำ {area.exact.toFixed(2)}</text>
  </Frame>;
}
