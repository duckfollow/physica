"use client";
import { useState } from "react";
import Link from "next/link";
import { Frame, Slider, Playback, useClock } from "./lab-primitives";
import { WIRE_MATERIALS, wireCircuit, type WireMaterialId } from "@/simulations/wire";

const MATERIAL_IDS = Object.keys(WIRE_MATERIALS) as WireMaterialId[];

const LOOK: Record<WireMaterialId, { fill: string; deep: string; soft: string }> = {
  copper: { fill: "#c9783f", deep: "#8d4d24", soft: "#f0d3b8" },
  aluminum: { fill: "#8f9ca8", deep: "#5a6772", soft: "#dce3e8" },
  iron: { fill: "#7d868f", deep: "#4c545c", soft: "#d5d9dd" },
  nichrome: { fill: "#b88755", deep: "#74532e", soft: "#ead7c0" },
};

function fmtR(r: number) {
  return r < 0.1 ? r.toExponential(2) : r.toFixed(2);
}

export function WireLab() {
  const voltage = 12;
  const load = 10;
  const [diameter, setDiameter] = useState(1);
  const [length, setLength] = useState(40);
  const [materialId, setMaterialId] = useState<WireMaterialId>("copper");
  const material = WIRE_MATERIALS[materialId];
  const look = LOOK[materialId];
  const clock = useClock();
  const m = wireCircuit(voltage, load, material.rho, length, diameter);
  const ideal = voltage / load;
  const wireStroke = 4 + diameter * 3.6;
  const crossR = 10 + diameter * 6.5;
  const heatGlow = Math.min(0.6, m.heatWire / 7);
  const wireShare = Math.max(0.03, m.fractionDrop);
  const barW = 480;
  const wireBar = wireShare * barW;
  const loadBar = Math.max(8, barW - wireBar);
  const heatWidth = Math.min(barW, (m.heatWire / 6) * barW);

  return <>
    <Frame
      title="ขนาดสายไฟ: R = ρL/A มีผลต่อกระแสอย่างไร?"
      stats={[
        ["R สาย", `${fmtR(m.resistance)} Ω`],
        ["กระแส I", `${m.current.toFixed(3)} A`],
        ["ตกคร่อมสาย", `${m.dropWire.toFixed(3)} V`],
        ["ความร้อนในสาย", `${m.heatWire.toFixed(3)} W`],
      ]}
      controls={
        <>
          <Slider label="เส้นผ่านศูนย์กลางสาย" min={0.4} max={4} step={0.1} value={diameter} unit="mm" onChange={(v) => { clock.reset(); setDiameter(v); }} />
          <Slider label="ความยาวสาย" min={5} max={120} step={5} value={length} unit="m" onChange={(v) => { clock.reset(); setLength(v); }} />
          <p className="hint">วัสดุสาย · ρ มีผลต่อ R โดยตรง</p>
          <div className="sim-levels" role="group" aria-label="วัสดุสาย">
            {MATERIAL_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className="mode-button"
                aria-pressed={materialId === id}
                style={materialId === id ? { background: LOOK[id].soft, borderColor: LOOK[id].deep, color: LOOK[id].deep } : undefined}
                onClick={() => { clock.reset(); setMaterialId(id); }}
              >
                {WIRE_MATERIALS[id].label}
              </button>
            ))}
          </div>
          <p className="hint"><strong>Rสาย = ρL/A</strong> · แบต {voltage} V · โหลด {load} Ω คงที่ · ρ = {material.rho.toExponential(2)} Ω·m</p>
          <Playback clock={clock} />
          <button className="mode-button" onClick={() => { clock.reset(); setDiameter(1); setLength(40); setMaterialId("copper"); }}>คืนค่าทองแดง 1 mm / 40 m</button>
          <p className="muted">สายหนาขึ้น → A เพิ่ม → R ลด · สายยาวขึ้น → R เพิ่ม · ρ สูง → R สูง</p>
        </>
      }
      note="วงจรอนุกรม: แบตเตอรี่ + สายไฟ + โหลดคงที่ · อุณหภูมิคงที่ · ไม่คิดผิวผลหรือความร้อนเปลี่ยน ρ"
    >
      <defs>
        <linearGradient id="wire-stage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7faf4" />
          <stop offset="100%" stopColor="#e5ede4" />
        </linearGradient>
        <linearGradient id="wire-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={look.soft} />
          <stop offset="40%" stopColor={look.fill} />
          <stop offset="100%" stopColor={look.deep} />
        </linearGradient>
        <filter id="wire-glow" x="-30%" y="-140%" width="160%" height="380%">
          <feGaussianBlur stdDeviation={1.5 + heatGlow * 7} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="10" y="12" width="700" height="376" rx="18" fill="url(#wire-stage)" />

      {/* return / lead wires */}
      <path d="M108 150 V250 H610 V110 H455" fill="none" stroke="#5f7a68" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M108 110 H128" fill="none" stroke="#5f7a68" strokeWidth="3.5" />

      {/* glowing wire underlay + metal wire */}
      <path
        d="M128 110 H300"
        fill="none"
        stroke={look.fill}
        strokeWidth={wireStroke + 8}
        strokeLinecap="round"
        opacity={0.12 + heatGlow * 0.55}
        filter={heatGlow > 0.05 ? "url(#wire-glow)" : undefined}
      />
      <path d="M128 110 H300" fill="none" stroke="url(#wire-metal)" strokeWidth={wireStroke} strokeLinecap="round" />
      <path d="M420 110 H455" fill="none" stroke="#5f7a68" strokeWidth="3.5" />

      {/* battery */}
      <g>
        <line x1="86" y1="110" x2="130" y2="110" stroke="#345e48" strokeWidth="5" />
        <line x1="96" y1="150" x2="120" y2="150" stroke="#345e48" strokeWidth="5" />
        <text x="68" y="114" fill="#345e48" fontSize="14">+</text>
        <text x="68" y="154" fill="#345e48" fontSize="14">−</text>
        <rect x="54" y="168" width="64" height="26" rx="8" fill="#fffef9" stroke="#c5d2c6" />
        <text x="86" y="186" textAnchor="middle" fill="#345e48" fontSize="13">{voltage} V</text>
      </g>

      {/* load block */}
      <g transform="translate(360,110)">
        <rect x="-52" y="-30" width="104" height="60" rx="12" fill="#eef4e4" stroke="#345e48" strokeWidth="2.5" />
        <path d="M-34 0 H-26 V-14 H-16 V14 H-6 V-14 H4 V14 H14 V-14 H24 V14 H34 V0" fill="none" stroke="#345e48" strokeWidth="2.4" strokeLinejoin="round" />
        <text y="48" textAnchor="middle" fill="#345e48" fontSize="13">โหลด {load} Ω</text>
      </g>

      {/* wire caption chip */}
      <rect x="148" y="48" width="132" height="28" rx="9" fill="#fffef9" stroke={look.deep} strokeWidth="1.5" />
      <text x="214" y="67" textAnchor="middle" fill={look.deep} fontSize="13" fontWeight="700">สาย {material.label}</text>
      <text x="214" y="148" textAnchor="middle" fill="#63776c" fontSize="12">
        ⌀ {diameter.toFixed(1)} mm · L {length} m · R {fmtR(m.resistance)} Ω
      </text>

      {/* current markers */}
      {m.current > 0 && Array.from({ length: 5 }, (_, i) => (
        <circle
          key={i}
          cx={140 + ((i / 5 + clock.time * Math.min(1.15, m.current) * 0.1) % 1) * 145}
          cy={110}
          r={3.4}
          fill="#d87951"
          stroke="#fffef9"
          strokeWidth="1"
        />
      ))}

      {/* cross-section */}
      <g transform="translate(610,95)">
        <rect x="-62" y="-58" width="124" height="126" rx="14" fill="#fffef9" stroke="#c5d2c6" />
        <text y="-34" textAnchor="middle" fill="#63776c" fontSize="12">หน้าตัดสาย</text>
        <circle r={crossR + 5} fill={look.soft} />
        <circle r={crossR} fill="url(#wire-metal)" stroke={look.deep} strokeWidth="2" />
        <line x1={-crossR} x2={crossR} y1="0" y2="0" stroke="#fffef9" strokeWidth="1.6" strokeDasharray="3 2" />
        <text y={48} textAnchor="middle" fill={look.deep} fontSize="13">⌀ {diameter.toFixed(1)} mm</text>
      </g>

      {/* voltage divider */}
      <text x="40" y="230" fill="#345e48" fontSize="13" fontWeight="700">การแบ่งแรงดันจากแบต {voltage} V</text>
      <rect x="40" y="242" width={barW} height="22" rx="11" fill="#d8e2d4" />
      <rect x="40" y="242" width={wireBar} height="22" rx="11" fill={look.fill} />
      <rect x={40 + wireBar} y="242" width={loadBar} height="22" rx="11" fill="#6f9a78" />
      <text x="40" y="286" fill={look.deep} fontSize="12">สาย {m.dropWire.toFixed(2)} V ({(m.fractionDrop * 100).toFixed(1)}%)</text>
      <text x="220" y="286" fill="#345e48" fontSize="12">โหลด {m.dropLoad.toFixed(2)} V</text>
      <text x="400" y="286" fill="#63776c" fontSize="12">เทียบสายอุดมคติ I = {ideal.toFixed(2)} A</text>

      {/* heat */}
      <text x="40" y="318" fill="#345e48" fontSize="13" fontWeight="700">ความร้อนในสาย P = I²R</text>
      <rect x="40" y="330" width={barW} height="14" rx="7" fill="#eadfd4" />
      <rect x="40" y="330" width={Math.max(6, heatWidth)} height="14" rx="7" fill="#d87951" />
      <text x="40" y="366" fill="#63776c" fontSize="13">
        I {m.current.toFixed(3)} A · ความร้อนสาย {m.heatWire.toFixed(3)} W · ที่โหลด {m.powerLoad.toFixed(3)} W · A {m.area.toExponential(2)} m²
      </text>
    </Frame>
    <div className="observe-strip">
      <strong>ลองเทียบ</strong>
      <p role="status">เพิ่มเส้นผ่านศูนย์กลางเป็นสองเท่า แล้วสลับเป็นนิโครมที่ขนาดเดิม — อย่างไหนทำให้ความร้อนในสายพุ่งชัดกว่า?</p>
    </div>
    <div className="sim-explanation">
      <details>
        <summary>ทำไมสายหนาแล้วกระแสถึงมักมากขึ้น?</summary>
        <p>จาก R = ρL/A เมื่อเส้นผ่านศูนย์กลางเพิ่ม พื้นที่หน้าตัด A โตตามกำลังสองของรัศมี ความต้านทานสายจึงลด วงจรอนุกรมกับโหลดคงที่มี R รวมน้อยลง กระแส I = V/Rรวม จึงสูงขึ้น และแรงดันตกคร่อมสายลดลง</p>
      </details>
      <details>
        <summary>ต่อจากกฎของโอห์ม</summary>
        <p>V = IR ยังใช้ได้ แต่ R ของสายไม่ได้ตั้งตรง ๆ แล้ว — คำนวณจากวัสดุ ความยาว และขนาดหน้าตัด ลองเทียบทองแดงกับนิโครมที่ขนาดเท่ากัน</p>
        <Link href="/simulations/ohm/">← กลับไป V = IR</Link>
        {" · "}
        <Link href="/simulations/circuit/">วงจรอนุกรม–ขนาน →</Link>
      </details>
    </div>
  </>;
}
