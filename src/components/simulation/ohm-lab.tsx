"use client";
import { useState } from "react";
import Link from "next/link";
import { Frame, Slider, Playback, useClock } from "./lab-primitives";
import { ohmLaw } from "@/simulations/ohm";

export function OhmLab(){
  const [voltage,setVoltage]=useState(6),[resistance,setResistance]=useState(3);
  const clock=useClock(),{current,power}=ohmLaw(voltage,resistance);
  const reached=Math.abs(current-1)<1e-9;
  return <>
    <Frame title="กฎของโอห์ม: แบตเตอรี่ + ตัวต้านทานหนึ่งตัว" stats={[["แรงดัน V",`${voltage} V`],["กระแส I",`${current.toFixed(2)} A`],["ความต้านทาน R",`${resistance} Ω`]]} controls={<>
      <Slider label="แรงดันแบตเตอรี่ V" value={voltage} min={0} max={12} step={0.5} unit="V" onChange={setVoltage}/>
      <Slider label="ความต้านทาน R" value={resistance} min={1} max={12} step={0.5} unit="Ω" onChange={setResistance}/>
      <p className="hint"><strong>I = V ÷ R</strong>{voltage} ÷ {resistance} = {current.toFixed(2)} A</p>
      <Playback clock={clock}/><button className="mode-button" onClick={()=>{clock.reset();setVoltage(6);setResistance(3);}}>คืนค่า 6 V / 3 Ω</button>
      <p className="muted">ค่าคำนวณเปลี่ยนทันที ปุ่มเล่นใช้ดูจุดเคลื่อนตามทิศกระแสตามข้อตกลง ไม่ใช่ความเร็วจริงของอิเล็กตรอน</p>
    </>} note="ตัวต้านทานโอห์มมิกที่อุณหภูมิคงที่ แบตเตอรี่ สายไฟ และแอมมิเตอร์อุดมคติ · กราฟใช้สเกลเดิมเพื่อเปรียบเทียบ">
      <path d="M100 110V70H600V205H100V145" fill="none" stroke="#345e48" strokeWidth="4"/>
      <line x1="75" y1="110" x2="125" y2="110" stroke="#345e48" strokeWidth="5"/><line x1="86" y1="145" x2="114" y2="145" stroke="#345e48" strokeWidth="5"/>
      <text x="55" y="108">+</text><text x="55" y="152">−</text><text x="40" y="185">{voltage} V</text>
      <rect x="285" y="52" width="120" height="36" rx="4" fill="#e0e7ca" stroke="#345e48" strokeWidth="2"/><text x="345" y="76" textAnchor="middle">R = {resistance} Ω</text>
      <circle cx="600" cy="135" r="24" fill="#fffef9" stroke="#345e48" strokeWidth="2"/><text x="600" y="140" textAnchor="middle">A</text><text x="550" y="177">{current.toFixed(2)} A</text>
      {current>0&&Array.from({length:7},(_,i)=><circle key={i} cx={155+((i/7+clock.time*current*0.06)%1)*390} cy="70" r="4" fill="#d47748"/>)}
      <text x="195" y="30">กระแสตามข้อตกลง: ขั้ว + → ตัวต้านทาน → ขั้ว −</text>
      <text x="300" y="145" textAnchor="middle">I = {voltage} / {resistance} = {current.toFixed(2)} A</text><text x="300" y="175" textAnchor="middle">กำลังที่ตัวต้านทาน {power.toFixed(2)} W</text>
      <path d="M100 255V370H600" fill="none" stroke="#6f8977"/>
      <text x="50" y="255">I (A)</text><text x="612" y="378">V (V)</text>
      {[0,6,12].map(v=><g key={v}><text x={100+v*40} y="391" textAnchor="middle">{v}</text><text x="86" y={374-v*9} textAnchor="end">{v}</text></g>)}
      <line x1="100" y1="370" x2="580" y2={370-12/resistance*9} stroke="#345e48" strokeWidth="3"/>
      <circle cx={100+voltage*40} cy={370-current*9} r="6" fill="#d47748"/>
      <text x="240" y="255">ความชัน = 1/R · จุดส้มคือค่าปัจจุบัน</text>
    </Frame>
    <div className="observe-strip"><strong>ภารกิจ: ให้ได้ 1 A</strong><p role="status">{reached?'สำเร็จ! แรงดันและความต้านทานที่เลือกทำให้ I = 1 A ✓':'ลองปรับ V หรือ R ให้กระแสเท่ากับ 1 A แล้วหาคำตอบอีกชุด'}</p></div>
    <div className="sim-explanation"><details><summary>ตัวอย่าง: ทำไม 6 V กับ 3 Ω ได้ 2 A?</summary><p>V คือแรงดันไฟฟ้า หน่วยโวลต์ · I คือกระแสไฟฟ้า หน่วยแอมแปร์ · R คือความต้านทาน หน่วยโอห์ม</p><p>จาก V = IR จัดรูปเป็น I = V/R แล้วแทนค่า 6/3 = 2 A หากเพิ่ม R เป็น 6 Ω โดยคง V ที่ 6 V กระแสจะเหลือ 1 A</p></details><details><summary>เฉลยภารกิจและคำถามต่อยอด</summary><p>ตัวอย่างคำตอบ: 3 V กับ 3 Ω หรือ 6 V กับ 6 Ω ให้กระแส 1 A เท่ากัน ถ้าเพิ่ม V สองเท่าโดยคง R กระแสจะเพิ่มสองเท่า</p><p>กฎนี้ใช้กับตัวต้านทานโอห์มมิกภายใต้สภาวะคงที่ ไม่ใช่อุปกรณ์ทุกชนิด เช่น ไดโอดหรือหลอดไส้ที่อุณหภูมิเปลี่ยนมาก</p><Link href="/simulations/wire/">ต่อยอดขนาดสายไฟ R = ρL/A →</Link>{" · "}<Link href="/simulations/circuit/">วงจรอนุกรม–ขนาน →</Link></details></div>
  </>;
}
