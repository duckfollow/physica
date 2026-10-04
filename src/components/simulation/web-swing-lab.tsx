"use client";
import { useMemo, useState } from "react";
import { Frame, Slider, Arrow, useClock } from "./lab-primitives";
import { swingPath, flightPath, BUILDINGS, SWING_G, type SwingPoint } from "@/simulations/web-swing";

const BACKDROP=[{x:2,h:7,w:3.2},{x:11,h:10,w:2.6},{x:21,h:6,w:2.8},{x:36,h:9,w:3},{x:40.5,h:5.5,w:2.4}];

export function WebSwingLab(){
  const [anchor,setAnchor]=useState(17),[length,setLength]=useState(14),[vectors,setVectors]=useState(true);
  const [release,setRelease]=useState<{time:number;point:SwingPoint}|null>(null);
  const swing=useMemo(()=>swingPath(anchor,length),[anchor,length]);
  const flight=useMemo(()=>release?flightPath(release.point):null,[release]);
  const finish=release&&flight?release.time+flight.points.at(-1)!.time:40;
  const clock=useClock(finish),ended=clock.time>=finish;
  const paused=!clock.playing&&clock.time>0&&!ended&&!release;
  const hanging=swing[Math.min(swing.length-1,Math.floor(clock.time/0.005))];
  const elapsed=release?Math.max(0,clock.time-release.time):0;
  const flightIndex=flight?Math.min(flight.points.length-1,Math.floor(elapsed/0.005)):0;
  const point=flight?(ended?flight.points.at(-1)!:flight.points[flightIndex]):hanging;
  const flightEnd=flight?.points.at(-1)?.time??0;
  const vx=release?release.point.vx:hanging.vx;
  const vy=release?release.point.vy-SWING_G*Math.min(elapsed,flightEnd):hanging.vy;
  const speed=Math.hypot(vx,vy);
  const sx=(x:number)=>55+(x+4)*13,sy=(y:number)=>365-y*12;
  const reset=()=>{clock.reset();setRelease(null);};
  const releaseNow=()=>{setRelease({time:clock.time,point:hanging});clock.play();};
  const outcomes={landed:'ถึงดาดฟ้าแล้ว',wall:'ชนตึก · ลองใหม่',ground:'ตกพื้น · ลองใหม่',outside:'ออกนอกฉาก'};
  const phase=ended?(flight?outcomes[flight.outcome]:'ครบเวลา'):release?'หลังปล่อย · วิถีโค้ง':clock.running?'กำลังโหน':paused?'หยุดภาพ · พร้อมปล่อย':'พร้อมเริ่ม';
  const playLabel=clock.running?'หยุดภาพ':clock.time>0&&!release?'เล่นต่อ':'เริ่มโหน';
  const trail=flight?flight.points.slice(0,ended?undefined:flightIndex+1).filter((_,i)=>i%3===0||i===flightIndex):[];
  const facing=vx< -0.4?-1:1;

  return <Frame title="ภารกิจโหนใย · ลงให้ถึงดาดฟ้าเป้าหมาย" stats={[["อัตราเร็ว",`${speed.toFixed(1)} m/s`],["แรงตึงใย",`${release?0:hanging.tension.toFixed(0)} N`],["เวลา",`${clock.time.toFixed(2)} s`]]} controls={<>
    <Slider label="จุดยึดแนวราบ" min={14} max={20} value={anchor} unit="m" onChange={v=>{reset();setAnchor(v);}}/>
    <Slider label="ความยาวใย" min={10} max={14} value={length} unit="m" onChange={v=>{reset();setLength(v);}}/>
    <div className="playback">
      <button className="button" disabled={ended} onClick={clock.toggle}>{playLabel}</button>
      <button className="button" disabled={!!release||ended} onClick={releaseNow}>ปล่อยใย</button>
      <button className="mode-button" onClick={reset}>เริ่มภารกิจใหม่</button>
    </div>
    <label className="check-label"><input type="checkbox" checked={vectors} onChange={e=>setVectors(e.target.checked)}/> แสดงลูกศรความเร็ว</label>
    <div className="hint" role="status"><strong>{phase}</strong><p>{paused?'ดูทิศลูกศรก่อนปล่อย · สำเร็จเมื่อลงบนดาดฟ้า ไม่นับชนขอบตึก':'โหนจากซ้าย ผ่านใต้จุดยึด แล้วหยุดภาพก่อนปล่อยเพื่อเทียบจังหวะ'}</p></div>
  </>} note="มวล 60 kg · จุดยึดสูง 26 m · เริ่มนิ่งที่ −60° · การถึงเป้าหมายไม่ใช่การประเมินความปลอดภัย">
    <defs>
      <linearGradient id="swing-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d9e7df"/><stop offset="55%" stopColor="#edf3ee"/><stop offset="100%" stopColor="#e4ebe0"/></linearGradient>
      <linearGradient id="swing-goal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6f9a78"/><stop offset="100%" stopColor="#4f7a5c"/></linearGradient>
    </defs>
    <rect x="10" y="15" width="700" height="350" rx="12" fill="url(#swing-sky)"/>
    <path d="M10 250C90 232 170 258 260 246C350 234 430 218 520 230C600 240 660 236 710 228V365H10Z" fill="#e2ebe3" opacity="0.85"/>
    {BACKDROP.map(b=><rect key={b.x} x={sx(b.x)} y={sy(b.h)} width={b.w*13} height={b.h*12} fill="#d5e0d6"/>)}
    {BUILDINGS.map(b=>{
      const x=sx(b.left),w=(b.right-b.left)*13,top=sy(b.roof),h=b.roof*12;
      return <g key={b.left}>
        <rect x={x} y={top} width={w} height={h} fill={b.goal?"url(#swing-goal)":"#9aab96"}/>
        <rect x={x} y={top-5} width={w} height="6" fill={b.goal?"#244d3d":"#5f7464"}/>
        {Array.from({length:Math.floor((b.right-b.left-0.8)/1.6)},(_,i)=>i).flatMap(i=>
          Array.from({length:Math.max(1,Math.floor(b.roof/3.2))},(_,r)=>
            <rect key={`${b.left}-${i}-${r}`} x={x+10+i*20} y={top+14+r*28} width="9" height="12" rx="1" fill={b.goal?"#d7e7d4":"#dfe6d8"} opacity="0.55"/>
          )
        )}
        {b.goal&&<rect x={x+4} y={top-1} width={w-8} height="3" fill="#f4f8ef"/>}
        <text x={x+w/2} y={top+22} textAnchor="middle" className={b.goal?"inverse-text":undefined}>{b.goal?"เป้าหมาย":"ตึกต้นทาง"}</text>
        <text x={x+w/2} y={top+38} textAnchor="middle" className={b.goal?"inverse-text":undefined}>{b.roof} m</text>
      </g>;
    })}
    <rect x="10" y="365" width="700" height="8" fill="#6d8574"/>
    <line x1="10" y1="365" x2="710" y2="365" stroke="#526d5b"/>
    <g>
      <rect x={sx(anchor)-18} y={sy(26)-8} width="36" height="10" rx="2" fill="#315d47"/>
      <line x1={sx(anchor)} y1={sy(26)-8} x2={sx(anchor)} y2={sy(26)+18} stroke="#315d47" strokeWidth="3"/>
      <circle cx={sx(anchor)} cy={sy(26)} r="5" fill="#183d30"/>
      <text x={sx(anchor)+14} y={sy(26)-10}>จุดยึด</text>
    </g>
    {!release&&<line x1={sx(anchor)} y1={sy(26)} x2={sx(point.x)} y2={sy(point.y)} stroke="#456e60" strokeWidth="2.5"/>}
    {trail.length>1&&<polyline points={trail.map(p=>`${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke="#c27443" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round"/>}
    <g transform={`translate(${sx(point.x)},${sy(point.y)}) scale(${facing},1)`}>
      <circle cy="-10" r="5.5" fill="#ca754d"/>
      <path d="M0 -3V8M-8 1L0 -1L8 1M0 8L-7 16M0 8L7 16" stroke="#294c3c" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </g>
    {vectors&&<Arrow x1={sx(point.x)} y1={sy(point.y)} x2={sx(point.x)+vx*3} y2={sy(point.y)-vy*3}/>}
    <text x="24" y="36" fill="#315d47">{paused?'หยุดภาพ · ดูลูกศรแล้วปล่อย':ended&&flight?.outcome==='landed'?'ถึงดาดฟ้าเป้าหมายแล้ว':ended&&flight?'ผล: '+outcomes[flight.outcome]:'ภารกิจ: ปล่อยใยให้ลงบนดาดฟ้าเขียว'}</text>
    <text x="24" y="390">ลูกศรส้ม = ความเร็ว · หลังปล่อยจะโค้งลงเพราะแรงโน้มถ่วง</text>
  </Frame>;
}
