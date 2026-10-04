"use client";
import { useMemo, useState } from "react";
import { Frame, Slider, Arrow, Playback, useClock } from "./lab-primitives";
import { trackHeight, coasterState, coasterLimit, buoyancy, orbitPath, ORBIT_SPEED_KMS, ORBIT_TIME_SECONDS } from "@/simulations/discovery";

export function CoasterLab() {
  const [height,setHeight]=useState(20),[loss,setLoss]=useState(0.5),[position,setPosition]=useState(0);
  const limit=coasterLimit(height,loss),x=Math.min(position,limit),state=coasterState(x,height,loss);
  const points=Array.from({length:401},(_,i)=>`${55+i*1.5},${310-trackHeight(i/5,height)*8}`).join(" ");
  const change=(setter:(v:number)=>void)=>(v:number)=>{setter(v);setPosition(0);};
  return <Frame title="รถไฟเหาะ: สำรวจพลังงานตามราง" stats={[["ความเร็ว",`${state.speed.toFixed(1)} m/s`],["ตำแหน่งตามแนวราบ",`${x.toFixed(1)} m`],["ไปถึงเนินปลายทาง",limit>=79.99?"ถึงได้ ✓":"พลังงานไม่พอ"]]} controls={<><Slider label="ความสูงจุดปล่อย" min={5} max={30} value={height} unit="m" onChange={change(setHeight)}/><Slider label="พลังงานสูญเสียต่อระยะทางแนวราบ" min={0} max={2} step={0.1} value={loss} unit="J/(kg·m)" onChange={change(setLoss)}/><Slider label="สำรวจตำแหน่งรถ" min={0} max={80} step={0.1} value={x} unit="m" onChange={setPosition}/><button className="mode-button" onClick={()=>setPosition(0)}>กลับจุดปล่อย ↺</button><p className="hint">เลื่อนรถเพื่อดูพลังงานแต่ละตำแหน่ง รถจะหยุดให้สำรวจที่ขอบเขตซึ่งพลังงานพาไปได้</p></>} note="ภาพสำรวจตำแหน่ง ไม่ใช่การเดินเวลา · รางยึดรถไว้ · พลังงานแสดงต่อมวล 1 kg">
    <line x1="55" y1="310" x2="660" y2="310" stroke="#bbc8b7"/>
    <polyline points={points} fill="none" stroke="#345e48" strokeWidth="5"/>
    <circle cx={55+x*7.5} cy={300-state.height*8} r="11" fill="#ce744b"/>
    <text x="55" y="35">ปล่อยจากหยุดนิ่ง {height} m</text><text x="545" y="190">เนินปลายทาง 12 m</text>
    {([["ศักย์",state.potential,"#345e48"],["จลน์",state.kinetic,"#cb7147"],["สูญเสีย",state.dissipated,"#a4a488"]] as const).map(([label,value,color],i)=><g key={label}><text x={55+i*205} y="347">{label} {value.toFixed(1)} J/kg</text><rect x={55+i*205} y="362" width="175" height="12" rx="4" fill="#e5eadd"/><rect x={55+i*205} y="362" width={175*value/(height*9.81)} height="12" rx="4" fill={color}/></g>)}
  </Frame>;
}

export function BuoyancyLab() {
  const [cargo,setCargo]=useState(300),[volume,setVolume]=useState(1),[density,setDensity]=useState(1000);
  const mass=200+cargo,model=buoyancy(mass,volume,density),width=170*Math.sqrt(volume),h=80;
  const bottom=model.sinking?340:200+h*model.fraction,top=bottom-h;
  return <Frame title="เรือบรรทุก: น้ำต้องพยุงน้ำหนักเท่าไร?" stats={[["สถานะ",model.sinking?"กำลังจม ↓":model.neutral?"ลอยตัวเป็นกลาง":"ลอยที่ผิวน้ำ ✓"],["แรงลอยตัว",`${model.force.toFixed(0)} N`],["น้ำหนักรวม",`${model.weight.toFixed(0)} N`]]} controls={<><Slider label="มวลสินค้า" min={0} max={1800} step={25} value={cargo} unit="kg" onChange={setCargo}/><Slider label="ปริมาตรตัวเรือปิดผนึก" min={0.5} max={2} step={0.1} value={volume} unit="m³" onChange={setVolume}/><label htmlFor="water-kind">ชนิดน้ำ</label><select id="water-kind" value={density} onChange={e=>setDensity(Number(e.target.value))}><option value={1000}>น้ำจืด · 1000 kg/m³</option><option value={1025}>น้ำทะเล · 1025 kg/m³</option></select><p className="hint">ตัวเรือหนัก 200 kg · รับสินค้าได้ถึง {(model.capacity-200).toFixed(0)} kg ก่อนเต็มปริมาตร แต่ที่ขีดจำกัดไม่มีส่วนพ้นน้ำ</p></>} note="เรือทรงกล่องปิดผนึก ไม่รับน้ำเข้า · ภาพจมเป็นสัญลักษณ์ ไม่จำลองความเร็วหรือความลึกตามเวลา">
    <rect x="30" y="200" width="660" height="185" fill="#dceeea"/><line x1="30" y1="200" x2="690" y2="200" stroke="#619789" strokeWidth="2"/>
    <rect x={350-width/2} y={top} width={width} height={h} rx="8" fill="#d6ab70" stroke="#345e48" strokeWidth="3"/>
    <rect x={350-width/2+4} y={Math.max(200,top)} width={width-8} height={Math.max(0,bottom-Math.max(200,top)-3)} fill="#679f9c" opacity="0.6"/>
    <text x="350" y={top+28} textAnchor="middle">มวลรวม {mass} kg</text>
    <Arrow x1={540} y1={235} x2={540} y2={235-model.force/200} color="#216859"/><Arrow x1={590} y1={235} x2={590} y2={235+model.weight/200}/>
    <text x="500" y="105">แรงน้ำ ↑</text><text x="575" y="365">น้ำหนัก ↓</text>
    <text x="45" y="55">ปริมาตรแทนที่น้ำ {model.submerged.toFixed(2)} m³</text><text x="45" y="85">จมน้ำ {(model.fraction*100).toFixed(0)}% ของตัวเรือ</text>
  </Frame>;
}

export function OrbitLab() {
  const [factor,setFactor]=useState(1);
  const result=useMemo(()=>orbitPath(factor),[factor]);
  const clock=useClock((result.points.length-1)/160),index=Math.min(result.points.length-1,Math.floor(clock.time*160));
  const point=result.points[index],scale=28,trail=result.points.slice(0,index+1).filter((_,i)=>i%4===0||i===index).map(p=>`${360+p.x*scale},${200-p.y*scale}`).join(" ");
  const labels={impact:"เส้นทางชนโลก",bound:"วงโคจรปิด",escape:"มีพลังงานหลุดพ้น"};
  return <Frame title="ปล่อยดาวเทียมจากระยะ 1.6 เท่ารัศมีโลก" stats={[["ความเร็วเริ่มต้น",`${(factor/Math.sqrt(1.6)*ORBIT_SPEED_KMS).toFixed(2)} km/s`],["เวลาหลังปล่อย",`${(point.time*ORBIT_TIME_SECONDS/60).toFixed(1)} นาที`],["ผลของเส้นทาง",labels[result.outcome]]]} controls={<><Slider label="ความเร็วเทียบกับวงโคจรวงกลม" min={0.3} max={1.8} step={0.05} value={factor} unit="เท่า" onChange={v=>{clock.reset();setFactor(v);}}/><Playback clock={clock}/><p className="hint">ลอง 0.5 → 1 → 1.5 เท่า แล้วเปรียบเทียบเส้นทาง ความเร็วหลุดพ้นเท่ากับ √2 ≈ 1.414 เท่าของความเร็ววงกลม ณ จุดปล่อย</p></>} note="เร่งเวลาประมาณ 1,031 เท่า · หยุดเมื่อชนโลก ถึงขอบ 6 รัศมีโลก หรือครบช่วงจำลอง · ขอบภาพไม่ใช่ขอบแรงโน้มถ่วง">
    {[2,4,6].map(r=><g key={r}><circle cx="360" cy="200" r={r*scale} fill="none" stroke="#d9e1d5" strokeDasharray="4 5"/><text x={365+r*scale} y="200">{r}R</text></g>)}
    <circle cx="360" cy="200" r={scale} fill="#4e918b"/><path d="M344 183L359 180L363 191L356 203L342 198Z M367 204L376 210L367 221" fill="#a5c59b"/>
    <polyline points={trail} fill="none" stroke="#b56842" strokeWidth="2"/><circle cx={360+point.x*scale} cy={200-point.y*scale} r="5" fill="#ce663b"/>
    <text x="40" y="30">โลกดึงเข้าหาศูนย์กลางตลอดเวลา</text><text x="40" y="380">ระยะขณะนี้ {Math.hypot(point.x,point.y).toFixed(2)} R · R = 6,371 km</text>
  </Frame>;
}
