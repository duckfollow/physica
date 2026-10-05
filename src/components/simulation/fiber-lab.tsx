"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Slider } from "./lab-primitives";
import { textBits, decodeBits, receiveBits, fiberPower, FIBER_THRESHOLD } from "@/simulations/fiber";

export function FiberLab(){
  const [message,setMessage]=useState('Hi'),[power,setPower]=useState(1),[length,setLength]=useState(10),[noise,setNoise]=useState(0),[seed,setSeed]=useState(1);
  const [position,setPosition]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(2);
  const bits=useMemo(()=>textBits(message),[message]),valid=bits.length>0&&bits.length<=512;
  const received=useMemo(()=>receiveBits(bits,power,length,noise,seed),[bits,power,length,noise,seed]);
  const count=Math.min(bits.length,Math.floor(position)),finished=valid&&count===bits.length;
  useEffect(()=>{
    if(!playing||!valid||finished)return;
    let frame=0,last:number|undefined;
    function tick(now:number){const dt=last===undefined?0:Math.min((now-last)/1000,0.05);last=now;setPosition(v=>Math.min(bits.length,v+dt*speed));frame=requestAnimationFrame(tick);}
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[playing,valid,finished,bits.length,speed]);
  const reset=()=>{setPosition(0);setPlaying(false);};
  const change=(setter:(v:number)=>void)=>(v:number)=>{reset();setter(v);};
  const actual=received.slice(0,count).map(v=>v.bit),errors=actual.reduce((n,b,i)=>n+Number(b!==bits[i]),0);
  const active=Math.min(count,bits.length-1),start=Math.floor(Math.max(0,active)/8)*8,window=bits.slice(start,start+8);
  const progress=position-count,current=bits[count]??0,peak=fiberPower(power,length);
  const output=decodeBits(actual,finished);
  return <div className="fiber-lab">
    <div className="lab">
      <div className="lab-visual">
        <div className="lab-top"><span>ข้อความ → UTF-8 → บิต → แสง → ข้อความ</span><span>ส่งทีละบิตเพื่อให้มองเห็น</span></div>
        <svg className="physics-stage" viewBox="0 0 720 340" role="img" aria-label="พัลส์แสงเดินทางจากเครื่องส่งผ่านสายไฟเบอร์ไปยังเครื่องรับ">
          <rect x="20" y="72" width="130" height="120" rx="14" fill="#e5ebdc"/><rect x="570" y="72" width="130" height="120" rx="14" fill="#e5ebdc"/>
          <text x="85" y="105" textAnchor="middle">เครื่องส่ง</text><text x="635" y="105" textAnchor="middle">เครื่องรับ</text>
          <text x="85" y="150" textAnchor="middle" style={{fontSize:26}}>{valid&&!finished?current:'—'}</text><text x="635" y="150" textAnchor="middle" style={{fontSize:26}}>{count?actual.at(-1):'—'}</text>
          <rect x="150" y="115" width="420" height="42" rx="20" fill="#d9e7eb"/><rect x="150" y="129" width="420" height="14" rx="7" fill="#a9c9c4"/>
          <text x="360" y="85" textAnchor="middle">เส้นใย {length} km · แกน + เปลือก</text>
          {valid&&!finished&&<g opacity={current?1:0.5}><circle cx={162+progress*395} cy="136" r="11" fill={current?'#df9151':'none'} stroke={current?'#df9151':'#5b7c77'} strokeDasharray={current?undefined:'3 3'}/>{current===1&&<circle cx={162+progress*395} cy="136" r="19" fill="#df9151" opacity={0.2}/>}</g>}
          <text x="360" y="194" textAnchor="middle">{finished?'ส่งครบแล้ว':current?'1 = ส่งพัลส์แสง':'0 = ไม่ส่งแสง · วงประบอกช่องเวลาเท่านั้น'}</text>
          <text x="30" y="235">สัญญาณฝั่งรับ (mW เทียบเท่า)</text>
          <line x1="30" y1="285" x2="690" y2="285" stroke="#b35e3a" strokeDasharray="5 4"/><text x="690" y="278" textAnchor="end">เกณฑ์ 0.25</text>
          {window.map((bit,i)=>{const index=start+i,done=index<count,sample=received[index]?.sample??0,h=Math.min(sample,2.5)*24;return <g key={index}><rect x={38+i*80} y={291-h} width="42" height={Math.max(1,h)} fill={done?(received[index].bit===bit?'#477461':'#b74733'):'#d8dfd1'} opacity={done?1:0.3}/><text x={59+i*80} y="317" textAnchor="middle">{done?received[index].bit:'·'}</text></g>;})}
          <text x="360" y="338" textAnchor="middle">แสดงครั้งละ 1 ไบต์ · แท่งสีปรากฏเมื่อบิตมาถึง</text>
        </svg>
        <div className="stats"><div><strong>{count}/{bits.length}</strong><span>บิตที่รับแล้ว</span></div><div><strong>{errors}</strong><span>บิตผิดพลาด</span></div><div><strong>{peak.toFixed(3)} mW</strong><span>กำลังพัลส์ก่อนสัญญาณรบกวน</span></div></div>
        <p className="muted">ภาพชะลอและส่งเรียงทีละบิต ไม่ใช่อัตราข้อมูลจริง · ความหน่วงเดินทางโดยประมาณ {(length*1000*1.47/299792458*1e6).toFixed(1)} µs (n ≈ 1.47)</p>
      </div>
      <div className="controls"><h2>ลองส่งข้อความ</h2>
        <label htmlFor="fiber-message">ข้อความต้นฉบับ</label><input className="fiber-message" id="fiber-message" value={message} maxLength={64} onChange={e=>{reset();setMessage(e.target.value);}} aria-describedby="fiber-limit"/>
        <p id="fiber-limit" className="muted">{bits.length/8}/64 ไบต์ UTF-8 · ภาษาไทยหนึ่งตัวอาจใช้หลายไบต์</p>
        {!valid&&<p role="alert">{bits.length===0?'พิมพ์ข้อความก่อนเริ่มส่ง':'ข้อความเกิน 64 ไบต์ กรุณาลดความยาว'}</p>}
        <Slider label="ความยาวสาย" value={length} min={0} max={80} step={5} unit="km" onChange={change(setLength)}/>
        <Slider label="กำลังส่งพัลส์" value={power} min={0.2} max={2} step={0.1} unit="mW" onChange={change(setPower)}/>
        <Slider label="สัญญาณรบกวนเครื่องรับ ±" value={noise} min={0} max={0.5} step={0.05} unit="mW เทียบเท่า" onChange={change(setNoise)}/>
        <label htmlFor="fiber-speed">ความเร็วภาพ</label><select id="fiber-speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={2}>ช้า · 2 บิต/วินาที</option><option value={8}>เร็ว · 8 บิต/วินาที</option><option value={32}>เร็วมาก · 32 บิต/วินาที</option></select>
        <div className="playback"><button className="button" disabled={!valid} onClick={()=>{if(finished){setPosition(0);setPlaying(true);}else setPlaying(v=>!v);}}>{finished?'ส่งใหม่ ▶':playing?'หยุดชั่วคราว Ⅱ':'เริ่มส่ง ▶'}</button><button className="mode-button" disabled={!valid||finished} onClick={()=>{setPlaying(false);setPosition(Math.min(bits.length,Math.floor(position)+1));}}>เดินทีละบิต →</button><button className="mode-button" onClick={reset}>กลับจุดเริ่มต้น ↺</button><button className="mode-button" onClick={()=>{reset();setSeed(v=>v+1);}}>สุ่มสัญญาณรบกวนชุดใหม่</button></div>
      </div>
    </div>
    <div className="fiber-results">
      <section><h3>บิตต้นฉบับ / บิตที่รับ</h3><p className="muted">ไบต์ที่ {Math.floor(start/8)+1} · สีแดง = รับต่างจากต้นฉบับ</p><div className="fiber-bits">{window.map((bit,i)=><div key={i} className={start+i<count&&received[start+i].bit!==bit?'fiber-error':''}><strong>{bit}</strong><span>{start+i<count?received[start+i].bit:'—'}</span></div>)}</div></section>
      <section><h3>ข้อความฝั่งรับ</h3><output className="fiber-output">{output||'รอข้อมูลครบตัวอักษร…'}</output><p role="status">{finished?(errors===0?'ส่งสำเร็จ ข้อความตรงกันทุกบิต ✓':`พบ ${errors} บิตผิดพลาด ลองเพิ่มกำลังส่งหรือลดความยาวสาย`):'แสดงข้อความเมื่อมีไบต์ครบตัวอักษร'}</p><p className="muted">หาก UTF-8 เสียหาย อาจเห็น � หรืออักขระควบคุมที่แสดงไม่ได้ · ยังไม่มีการแก้ข้อผิดพลาด</p></section>
    </div>
    <details className="fiber-inset"><summary>ขยายดู: ทำไมแสงอยู่ในเส้นใย?</summary><svg viewBox="0 0 720 180" role="img" aria-label="ภาพเชิงสัญลักษณ์ของแสงสะท้อนกลับหมดในแกนที่มีดัชนีสูงกว่าเปลือก"><rect x="25" y="25" width="670" height="130" rx="10" fill="#dce8ed"/><rect x="25" y="55" width="670" height="70" fill="#b4d2c5"/><path d="M25 90L140 55L370 125L600 55L695 84" fill="none" stroke="#c66d3c" strokeWidth="3"/><text x="40" y="45">เปลือก: ดัชนีต่ำกว่า</text><text x="280" y="92">แกน: ดัชนีสูงกว่า</text></svg><p>รังสีจากแกนที่ตกกระทบรอยต่อด้วยมุมมากกว่ามุมวิกฤต (วัดจากเส้นตั้งฉาก) จะสะท้อนกลับหมด ภาพนี้ขยายขนาดและมุมเพื่ออธิบาย ไม่ใช่วิถีจริงของไฟเบอร์ทุกชนิด</p><Link href="/simulations/refraction/">ลองปรับมุมและตัวกลางในการทดลองการหักเห →</Link></details>
    <p className="model-note">แบบจำลอง OOK อุดมคติ: 1 มีแสง / 0 ไม่มีแสง · สูญเสีย 0.2 dB/km · เกณฑ์เครื่องรับคงที่ {FIBER_THRESHOLD} mW · สัญญาณรบกวนแบบสุ่มสม่ำเสมอที่เครื่องรับ ไม่จำลอง dispersion ข้อต่อ โปรโตคอล หรือการแก้ข้อผิดพลาด</p>
  </div>;
}
