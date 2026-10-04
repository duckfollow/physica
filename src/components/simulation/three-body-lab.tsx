"use client";
import { useMemo, useState } from "react";
import { Frame, Playback, useClock } from "./lab-primitives";
import { threeBodyInitial, threeBodyPath, type ThreeBodyPreset } from "@/simulations/three-body";

const COLORS = ["#ce663b", "#345e48", "#4e7fa8"] as const;
const LABELS: Record<ThreeBodyPreset, string> = {
  figure8: "รูปเลข 8 (คาบ)",
  lagrange: "ลากรองจ์ ทรงสามเหลี่ยม",
  hierarchical: "มวลหนัก + คู่เบา",
  perturbed: "รูปเลข 8 ถูกรบกวน",
};

export function ThreeBodyLab() {
  const [preset, setPreset] = useState<ThreeBodyPreset>("figure8");
  const result = useMemo(() => threeBodyPath(preset, 6000, 0.002), [preset]);
  const masses = useMemo(() => threeBodyInitial(preset).map((b) => b.m), [preset]);
  const duration = (result.trails[0].length - 1) / 180;
  const clock = useClock(duration);
  const index = Math.min(result.trails[0].length - 1, Math.floor(clock.time * 180));
  const scale = preset === "hierarchical" ? 72 : 110;
  const cx = 360, cy = 200;

  const trails = result.trails.map((trail, i) =>
    trail
      .slice(0, index + 1)
      .filter((_, k) => k % 3 === 0 || k === index)
      .map((p) => `${cx + p.x * scale},${cy - p.y * scale}`)
      .join(" "),
  );

  return (
    <Frame
      title="สามมวลดึงกันด้วยแรงโน้มถ่วง"
      stats={[
        ["ฉาก", LABELS[preset]],
        ["เวลาจำลอง", `${(index * result.dt).toFixed(2)}`],
        ["การเลื่อนพลังงาน", `${(result.energyDrift * 100).toFixed(3)} %`],
      ]}
      controls={
        <>
          <label htmlFor="three-body-preset">ฉากเริ่มต้น</label>
          <select
            id="three-body-preset"
            value={preset}
            onChange={(e) => {
              clock.reset();
              setPreset(e.target.value as ThreeBodyPreset);
            }}
          >
            <option value="figure8">รูปเลข 8 · คาบพิเศษ</option>
            <option value="lagrange">ลากรองจ์ · สามเหลี่ยมหมุน</option>
            <option value="hierarchical">ลำดับชั้น · ดาวกลางหนัก</option>
            <option value="perturbed">รบกวนเล็กน้อย · วุ่นวาย</option>
          </select>
          <Playback clock={clock} />
          <p className="hint">
            เทียบรูปเลข 8 กับฉากรบกวน: ค่าเริ่มต่างเพียงเล็กน้อย แต่เส้นทางแยกกันชัดเมื่อเวลาผ่านไป
          </p>
        </>
      }
      note="G = 1 · มวลเป็นหน่วยสัมพัทธ์ · มี soft potential ป้องกันการชนจุด · หน่วยเวลาเป็นหน่วยจำลอง ไม่ใช่วินาทีจริง"
    >
      <rect x="30" y="30" width="660" height="340" rx="12" fill="#edf3ee" />
      {[1, 2].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r * scale * 0.55} fill="none" stroke="#d5e0d4" strokeDasharray="4 5" />
      ))}
      {trails.map((points, i) => (
        <polyline key={i} points={points} fill="none" stroke={COLORS[i]} strokeWidth="2" opacity="0.85" />
      ))}
      {result.trails.map((trail, i) => {
        const p = trail[index];
        const r = 6 + Math.sqrt(masses[i]) * 3;
        return (
          <g key={i}>
            <circle cx={cx + p.x * scale} cy={cy - p.y * scale} r={r} fill={COLORS[i]} />
            <text x={cx + p.x * scale + 12} y={cy - p.y * scale - 10} fill={COLORS[i]}>
              m{i + 1}
            </text>
          </g>
        );
      })}
      <text x="45" y="55">แต่ละมวลดึงอีกสองมวล · ไม่มีศูนย์กลางคงที่โดยทั่วไป</text>
      <text x="45" y="355">
        {preset === "perturbed"
          ? "การรบกวนเล็กน้อยทำให้คาบรูปเลข 8 พัง → ความไวต่อเงื่อนไขเริ่มต้น"
          : preset === "lagrange"
            ? "สามมวลหมุนรอบจุดศูนย์กลางมวลในรูปสามเหลี่ยมด้านเท่า"
            : preset === "hierarchical"
              ? "มวลหนักดึงคู่เบาให้โคจรใกล้ ๆ ขณะที่ระบบรวมยังเคลื่อน"
              : "ทั้งสามมวลไล่ตามกันเป็นรูปเลข 8 คาบเดียวกัน"}
      </text>
    </Frame>
  );
}
