"use client";
import { useState } from "react";
import { Frame, Slider, Playback, useClock, Arrow } from "./lab-primitives";
import { osmosisCell, mixAcidBase, indicatorHue } from "@/simulations/life-science";

export function OsmosisLab() {
  const [internal,setInternal]=useState(0.3),[external,setExternal]=useState(0.1);
  const clock=useClock(6),model=osmosisCell(internal,external,clock.time);
  const labels={turgid:'เต่ง · น้ำเข้าเซลล์',flaccid:'อ่อนตัว · ใกล้สมดุล',plasmolyzed:'เหี่ยว · น้ำออกจากเซลล์'};
  const tonicity={hypotonic:'ภายนอกเจือจางกว่า',hypertonic:'ภายนอกเข้มข้นกว่า',isotonic:'ความเข้มข้นใกล้เคียง'};
  const r=48*model.volume,cx=360,cy=210;
  return <Frame title="เซลล์พืช: น้ำจะเข้าหรือออก?" stats={[["ปริมาตรสัมพัทธ์",`${model.volume.toFixed(2)} ×`],["สถานะเซลล์",labels[model.outcome]],["สารละลายภายนอก",tonicity[model.tonicity]]]} controls={<>
    <Slider label="ความเข้มข้นในเซลล์" min={0.05} max={0.6} step={0.05} value={internal} unit="mol/L" onChange={v=>{clock.reset();setInternal(v);}}/>
    <Slider label="ความเข้มข้นภายนอก" min={0.05} max={0.6} step={0.05} value={external} unit="mol/L" onChange={v=>{clock.reset();setExternal(v);}}/>
    <Playback clock={clock}/>
    <p className="hint">เริ่มเล่นแล้วดูปริมาตรเปลี่ยน · ภายนอกเจือจางกว่า → น้ำเข้า · ภายนอกเข้มข้นกว่า → น้ำออก</p>
  </>} note="แบบจำลองเชิงการศึกษา · ผนังเซลล์จำกัดการพอง · ไม่จำลองไอออนทุกชนิดหรือแรงดันจริง">
    <rect x="30" y="40" width="660" height="320" rx="12" fill={`hsl(${120-external*80} 28% 90%)`}/>
    <text x="50" y="70">สารละลายภายนอก {external.toFixed(2)} mol/L</text>
    <ellipse cx={cx} cy={cy} rx={r+18} ry={r+14} fill="none" stroke="#6d8574" strokeWidth="3"/>
    <ellipse cx={cx} cy={cy} rx={r} ry={r*0.92} fill={`hsl(${135-internal*70} 35% 72%)`} stroke="#315d47" strokeWidth="3"/>
    <ellipse cx={cx-r*0.2} cy={cy-r*0.15} rx={r*0.35} ry={r*0.3} fill="#e8f0df" opacity="0.7"/>
    <text x={cx} y={cy+6} textAnchor="middle" fill="#183d30">ในเซลล์ {internal.toFixed(2)}</text>
    {model.tonicity!=='isotonic'&&<Arrow x1={model.waterIn?280:440} y1={cy} x2={model.waterIn?310:410} y2={cy} color="#216859"/>}
    <text x="50" y="340">{labels[model.outcome]}</text>
    <text x="50" y="365">ลูกศร = ทิศทางสุทธิของน้ำ · วงนอก = ผนังเซลล์</text>
  </Frame>;
}

export function AcidBaseLab() {
  const [acidM,setAcidM]=useState(0.1),[baseM,setBaseM]=useState(0.1),[acidMl,setAcidMl]=useState(25),[baseMl,setBaseMl]=useState(25);
  const model=mixAcidBase(acidM,acidMl/1000,baseM,baseMl/1000);
  const hue=indicatorHue(model.pH);
  const status={acidic:'เป็นกรด',basic:'เป็นเบส',neutral:'ใกล้กลาง'};
  const fill=Math.min(210,40+(acidMl+baseMl)*2.2);
  return <Frame title="ผสมกรดกับเบสแล้ว pH เป็นเท่าไร?" stats={[["pH",model.pH.toFixed(2)],["สถานะ",status[model.status]],["ปริมาตรรวม",`${(model.volume*1000).toFixed(0)} mL`]]} controls={<>
    <Slider label="ความเข้มข้นกรดแรง" min={0} max={0.5} step={0.05} value={acidM} unit="mol/L" onChange={setAcidM}/>
    <Slider label="ปริมาตรกรด" min={0} max={50} step={5} value={acidMl} unit="mL" onChange={setAcidMl}/>
    <Slider label="ความเข้มข้นเบสแรง" min={0} max={0.5} step={0.05} value={baseM} unit="mol/L" onChange={setBaseM}/>
    <Slider label="ปริมาตรเบส" min={0} max={50} step={5} value={baseMl} unit="mL" onChange={setBaseMl}/>
    <p className="hint">โมลกรดและโมลเบสหักกัน · เหลือฝั่งไหนมาก pH จะเอนไปทางนั้น สีในบีกเกอร์เป็นตัวบ่งชี้เชิงสัญลักษณ์</p>
  </>} note="สมมติกรดและเบสแก่ที่แตกตัวหมด · ไม่มีบัฟเฟอร์ · ที่ 25 °C · Kw = 1×10⁻¹⁴">
    <rect x="40" y="40" width="250" height="300" rx="10" fill="#f6f8f3" stroke="#9aac9b" strokeWidth="2"/>
    <rect x="52" y={330-fill} width="226" height={fill} rx="6" fill={`hsl(${hue} 55% 68%)`}/>
    <text x="165" y="70" textAnchor="middle">หลังผสม</text>
    <text x="165" y="200" textAnchor="middle" className="temperature-label">pH {model.pH.toFixed(2)}</text>
    <text x="165" y="360" textAnchor="middle">{(model.volume*1000).toFixed(0)} mL · {status[model.status]}</text>
    <g>
      <rect x="360" y="80" width="120" height="160" rx="8" fill="#f1d7d0" stroke="#b56845"/>
      <text x="420" y="120" textAnchor="middle">กรด</text>
      <text x="420" y="155" textAnchor="middle">{acidM.toFixed(2)} M</text>
      <text x="420" y="185" textAnchor="middle">{acidMl} mL</text>
      <rect x="540" y="80" width="120" height="160" rx="8" fill="#d7e4f0" stroke="#4f7390"/>
      <text x="600" y="120" textAnchor="middle">เบส</text>
      <text x="600" y="155" textAnchor="middle">{baseM.toFixed(2)} M</text>
      <text x="600" y="185" textAnchor="middle">{baseMl} mL</text>
      <Arrow x1={420} y1={250} x2={200} y2={300} color="#8a6a4a"/>
      <Arrow x1={600} y1={250} x2={250} y2={300} color="#4f7390"/>
    </g>
    <text x="360" y="340">เหลือโมลสุทธิ {(model.excess*1000).toFixed(2)} mmol H⁺ (− หมายถึง OH⁻ เหลือ)</text>
  </Frame>;
}
