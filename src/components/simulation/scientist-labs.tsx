"use client";
import { useMemo, useState } from "react";
import { Frame, Slider, Arrow } from "./lab-primitives";
import {
  torricelliColumn,
  youngFringes,
  youngIntensity,
  rutherfordScatter,
  rutherfordHistogram,
} from "@/simulations/scientists";

export function TorricelliLab() {
  const [pressureKPa, setPressureKPa] = useState(101.3);
  const [density, setDensity] = useState(13600);
  const col = torricelliColumn(pressureKPa * 1000, density);
  const tubeTop = 40, tubeBottom = 340, maxH = density >= 10000 ? 0.9 : 12;
  const fillH = Math.min(tubeBottom - tubeTop - 20, ((col.height / maxH) * (tubeBottom - tubeTop - 20)));
  const meniscus = tubeBottom - fillH;
  const liquid = density >= 10000 ? "#9aa3a8" : "#7eb0ad";
  return (
    <Frame
      title="บารอมิเตอร์ทอริดเซลลี: อากาศพยุงคอลัมน์ได้สูงแค่ไหน?"
      stats={[
        ["ความสูงคอลัมน์", density >= 10000 ? `${col.heightMm.toFixed(0)} mm` : `${col.height.toFixed(2)} m`],
        ["ความดันอากาศ", `${pressureKPa.toFixed(1)} kPa`],
        ["เทียบมาตรฐาน", `${(col.pressureAtm * 100).toFixed(0)}% ของ 1 atm`],
      ]}
      controls={
        <>
          <Slider label="ความดันอากาศ" min={70} max={110} step={0.5} value={pressureKPa} unit="kPa" onChange={setPressureKPa} />
          <label htmlFor="torricelli-fluid">ของเหลวในหลอด</label>
          <select id="torricelli-fluid" value={density} onChange={(e) => setDensity(Number(e.target.value))}>
            <option value={13600}>ปรอท · 13,600 kg/m³</option>
            <option value={1000}>น้ำ · 1,000 kg/m³</option>
          </select>
          <p className="hint">ลดความดันอากาศแล้วดูคอลัมน์สั้นลง · สลับเป็นน้ำจะเห็นว่าต้องใช้หลอดสูงมาก</p>
        </>
      }
      note="เหนือคอลัมน์เป็นสุญญากาศในอุดมคติ · P₀ = ρgh · ไม่จำลองไอของเหลวหรืออุณหภูมิ"
    >
      <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef4f2" />
      <rect x="80" y="280" width="220" height="60" rx="8" fill={liquid} opacity="0.85" stroke="#345e48" strokeWidth="3" />
      <path d="M160 280 V40 H220 V280" fill="none" stroke="#345e48" strokeWidth="5" />
      <rect x="165" y={meniscus} width="50" height={tubeBottom - 20 - meniscus} fill={liquid} />
      <rect x="165" y={tubeTop} width="50" height={meniscus - tubeTop} fill="#f7faf6" opacity="0.7" />
      <text x="240" y={meniscus + 6}>h</text>
      <line x1="230" y1={meniscus} x2="230" y2={tubeBottom - 20} stroke="#ce663b" strokeWidth="2" />
      <Arrow x1={50} y1={250} x2={75} y2={250} color="#345e48" />
      <text x="40" y="230">P₀</text>
      <text x="40" y="48">อากาศกดผิวอ่าง → พยุงคอลัมน์ในหลอด</text>
      <text x="360" y="80">ปรอทมาตรฐาน ≈ 760 mm ที่ 1 atm</text>
      <text x="360" y="120">ขณะนี้ {density >= 10000 ? `${col.heightMm.toFixed(0)} mm` : `${(col.height * 100).toFixed(0)} cm`}</text>
      <text x="40" y="360">สุญญากาศด้านบน · ความดันอากาศ = น้ำหนักของเสาของเหลวต่อพื้นที่</text>
    </Frame>
  );
}

export function YoungLab() {
  const [wavelength, setWavelength] = useState(550);
  const [slitSep, setSlitSep] = useState(0.25);
  const [screenDist, setScreenDist] = useState(1.5);
  const fringe = youngFringes(wavelength, slitSep, screenDist);
  const halfWidth = 0.008;
  const samples = 120;
  const bars = useMemo(
    () =>
      Array.from({ length: samples }, (_, i) => {
        const x = -halfWidth + (2 * halfWidth * i) / (samples - 1);
        const I = youngIntensity(x, wavelength, slitSep, screenDist);
        return { x, I };
      }),
    [wavelength, slitSep, screenDist],
  );
  const hue = Math.max(0, Math.min(300, (650 - wavelength) * 0.9));
  return (
    <Frame
      title="สลิตคู่ของยัง: แถบสว่างห่างกันเท่าไร?"
      stats={[
        ["ระยะแถบ Δy", `${fringe.spacingMm.toFixed(2)} mm`],
        ["ความยาวคลื่น", `${wavelength} nm`],
        ["ระยะสลิต d", `${slitSep.toFixed(2)} mm`],
      ]}
      controls={
        <>
          <Slider label="ความยาวคลื่น" min={400} max={700} step={10} value={wavelength} unit="nm" onChange={setWavelength} />
          <Slider label="ระยะห่างสลิต" min={0.1} max={0.6} step={0.01} value={slitSep} unit="mm" onChange={setSlitSep} />
          <Slider label="ระยะถึงจอ" min={0.5} max={3} step={0.1} value={screenDist} unit="m" onChange={setScreenDist} />
          <p className="hint">เพิ่ม d หรือลด λ → แถบชิดกัน · สูตรประมาณ Δy = λL/d</p>
        </>
      }
      note="แสงเลเซอร์เชิงสัญลักษณ์ สลิตแคบสองช่อง · มุมเล็ก · ไม่จำลองความกว้างสลิตเดียว"
    >
      <rect x="10" y="15" width="700" height="350" rx="12" fill="#1c2924" />
      <rect x="70" y="80" width="12" height="200" fill="#d8e2d4" />
      <rect x="70" y="155" width="12" height="8" fill="#1c2924" />
      <rect x="70" y="195" width="12" height="8" fill="#1c2924" />
      <text x="55" y="70" fill="#d8e2d4">สลิต</text>
      <line x1="82" y1="159" x2="560" y2="100" stroke={`hsl(${hue} 70% 60%)`} strokeWidth="1.5" opacity="0.5" />
      <line x1="82" y1="199" x2="560" y2="260" stroke={`hsl(${hue} 70% 60%)`} strokeWidth="1.5" opacity="0.5" />
      <rect x="560" y="60" width="28" height="240" fill="#0f1714" stroke="#9aac9b" strokeWidth="2" />
      {bars.map((b, i) => {
        const y = 70 + ((b.x + halfWidth) / (2 * halfWidth)) * 220;
        return (
          <rect
            key={i}
            x="562"
            y={y}
            width="24"
            height={220 / samples + 0.5}
            fill={`hsl(${hue} 80% ${20 + b.I * 55}%)`}
          />
        );
      })}
      <text x="100" y="48" fill="#d8e2d4">แทรกสอดบนจอ</text>
      <text x="100" y="360" fill="#d8e2d4">Δy ≈ {fringe.spacingMm.toFixed(2)} mm ระหว่างแถบสว่าง</text>
    </Frame>
  );
}

export function RutherfordLab() {
  const [b, setB] = useState(20);
  const [energy, setEnergy] = useState(5);
  const hit = rutherfordScatter(b, energy);
  const hist = useMemo(() => rutherfordHistogram(energy, 360, 400, 16), [energy]);
  const maxCount = Math.max(...hist.counts, 1);
  // hyperbolic-like path sketch from left toward nucleus
  const nucleusX = 360, nucleusY = 200;
  const startX = 80;
  const impactY = nucleusY - b * 1.6;
  const deflect = Math.min(150, hit.thetaDeg * 1.1);
  const endX = 620;
  const endY = impactY + (impactY < nucleusY ? -deflect : deflect);
  const midX = nucleusX - 40;
  const path = `M${startX} ${impactY} Q${midX} ${impactY} ${nucleusX - 10} ${nucleusY + (impactY - nucleusY) * 0.15} T${endX} ${endY}`;
  return (
    <Frame
      title="รัทเทอร์ฟอร์ด: แอลฟาเบี่ยงเมื่อใกล้นิวเคลียส?"
      stats={[
        ["มุมกระเจิง", `${hit.thetaDeg.toFixed(1)}°`],
        ["พารามิเตอร์กระแทก b", `${b.toFixed(0)} fm`],
        ["เข้าใกล้สุด (หัวชน)", `${hit.closestApproach.toFixed(1)} fm`],
      ]}
      controls={
        <>
          <Slider label="พารามิเตอร์กระแทก b" min={2} max={80} step={1} value={b} unit="fm" onChange={setB} />
          <Slider label="พลังงานจลน์แอลฟา" min={1} max={10} step={0.5} value={energy} unit="MeV" onChange={setEnergy} />
          <p className="hint">ลด b ให้เล็งใกล้นิวเคลียสมากขึ้น → มุมเบี่ยงพุ่งสูง · ฮิสโทแกรมขวาแสดงว่าส่วนใหญ่เบี่ยงน้อย</p>
        </>
      }
      note="เป้าทอง Z = 79 · แอลฟา Z = 2 · สูตร Coulomb จุด · ไม่จำลองนิวเคลียสมีขนาดหรือปฏิกิริยานิวเคลียร์"
    >
      <rect x="10" y="15" width="700" height="350" rx="12" fill="#eef3ee" />
      <circle cx={nucleusX} cy={nucleusY} r="14" fill="#d87951" />
      <circle cx={nucleusX} cy={nucleusY} r="28" fill="none" stroke="#d87951" strokeDasharray="4 4" opacity="0.5" />
      <text x={nucleusX} y={nucleusY - 36} textAnchor="middle">นิวเคลียส Au</text>
      <path d={path} fill="none" stroke="#345e48" strokeWidth="3" />
      <circle cx={startX} cy={impactY} r="5" fill="#345e48" />
      <text x="40" y="48">เส้นทางแอลฟา · b เล็ก = เล็งใกล้ศูนย์กลาง</text>
      <text x="40" y="360">มุมเบี่ยง {hit.thetaDeg.toFixed(1)}° · พลังงาน {energy} MeV</text>
      {hist.counts.map((c, i) => {
        const barH = (c / maxCount) * 90;
        const x = 520 + i * 10;
        return <rect key={i} x={x} y={140 - barH} width="8" height={barH} fill="#4e7fa8" opacity="0.85" />;
      })}
      <text x="520" y="155">มุมน้อย → มาก</text>
      <text x="520" y="50">การกระจายมุม</text>
    </Frame>
  );
}
