"use client";
import { useMemo, useState } from 'react';
import { Frame, Slider, Playback, useClock, Arrow } from './lab-primitives';
import { waterHistory } from '@/simulations/water-cycle';
const stages=[
 {name:'1. การระเหย',text:'พลังงานจากดวงอาทิตย์ช่วยให้น้ำของเหลวกลายเป็นไอน้ำ ไอน้ำจริงมองไม่เห็น จุดที่ลอยขึ้นเป็นสัญลักษณ์ ไม่ใช่หยดน้ำที่มองเห็น'},
 {name:'2. การควบแน่น',text:'เมื่ออากาศที่มีไอน้ำเย็นลงจนถึงภาวะอิ่มตัว น้ำอาจควบแน่นเป็นหยดเล็ก ๆ หรือผลึกน้ำแข็ง เมฆจึงไม่ใช่ไอน้ำล้วน ๆ'},
 {name:'3. ฝนตก',text:'หยดน้ำในเมฆเติบโตและรวมตัว เมื่อมีเงื่อนไขเหมาะสมจึงตกเป็นฝน เมฆทุกก้อนไม่จำเป็นต้องมีฝนตก'},
 {name:'4. น้ำกลับสู่แหล่งน้ำ',text:'น้ำฝนบางส่วนตกลงแหล่งน้ำโดยตรง อีกส่วนไหลบนผิวดินหรือซึมลงดินและกลับสู่แหล่งน้ำ กระบวนการจริงมีหลายเส้นทาง ไม่ได้เรียงคิวทีละขั้นเสมอไป'},
];
export function WaterCycleLab(){
 const [sun,setSun]=useState(1),[cooling,setCooling]=useState(1),[stage,setStage]=useState(0);
 const clock=useClock(120),history=useMemo(()=>waterHistory(sun,cooling),[sun,cooling]);
 const {state,flux}=history[Math.min(1200,Math.floor(clock.time*10))];
 const amounts=[['แหล่งน้ำ',state.surface,'#559ab5'],['ไอน้ำ',state.vapor,'#b0c6c5'],['น้ำในเมฆ',state.cloud,'#c4cddd'],['น้ำบน/ใต้ดิน',state.land,'#94ad79']] as const;
 return <><Frame title="วัฏจักรน้ำ: น้ำเปลี่ยนที่และเปลี่ยนสถานะ" stats={[["แหล่งน้ำ",`${state.surface.toFixed(1)} หน่วย`],["น้ำในเมฆ",`${state.cloud.toFixed(1)} หน่วย`],["น้ำรวมทั้งระบบ",`${(state.surface+state.vapor+state.cloud+state.land).toFixed(1)} หน่วย`]]} controls={<>
 <Slider label="พลังงานจากดวงอาทิตย์" min={0} max={2} step={0.1} value={sun} unit="เท่า" onChange={v=>{clock.reset();setSun(v);}}/>
 <Slider label="การเย็นตัวของอากาศ" min={0} max={2} step={0.1} value={cooling} unit="เท่า" onChange={v=>{clock.reset();setCooling(v);}}/>
 <Playback clock={clock}/><p className="muted">เวลาแบบจำลอง {clock.time.toFixed(1)} / 120 · เปลี่ยนตัวแปรแล้วเริ่มใหม่เพื่อเปรียบเทียบจากน้ำตั้งต้นเท่ากัน</p>
 <div className="playback">{stages.map((s,i)=><button key={s.name} className="mode-button" aria-pressed={stage===i} onClick={()=>setStage(i)}>{s.name}</button>)}</div>
 </>} note="แบบจำลองเชิงแนวคิด ระบบปิดมีน้ำรวม 100 หน่วย เวลาและอัตราถ่ายโอนเป็นค่าประกอบการสอน ไม่ใช่การพยากรณ์อากาศ">
 <rect x="15" y="10" width="690" height="325" rx="15" fill="#edf4ed"/>
 <circle cx="83" cy="65" r={24+sun*3} fill="#e9b557" opacity={0.3+sun*0.35}/><text x="35" y="112">ดวงอาทิตย์</text>
 <path d="M320 280L450 147L520 230L585 183L705 285V335H320Z" fill="#abc39a"/><path d="M430 170L450 147L477 180L451 174Z" fill="#f8faf2"/>
 <path d="M15 280Q160 260 325 282V335H15Z" fill="#5c9eb5"/><path d="M453 267Q400 276 420 291T324 320" fill="none" stroke="#5c9eb5" strokeWidth="9"/>
 <g fill="#cbd5dd" opacity={0.45+Math.min(1,state.cloud/30)*0.55}><ellipse cx="377" cy="99" rx="95" ry="28"/><circle cx="344" cy="79" r="31"/><circle cx="388" cy="75" r="37"/><circle cx="432" cy="88" r="28"/></g>
 {flux.evaporation>0&&Array.from({length:7},(_,i)=>{const f=(clock.time*0.12+i/7)%1;return <circle key={i} cx={178+i%3*20+f*70} cy={270-f*135} r="4" fill="#8cafb6" opacity={0.7}/>;})}
 {flux.rain>0&&Array.from({length:12},(_,i)=>{const f=(clock.time*0.3+i/12)%1;return <line key={i} x1={320+i%6*21} y1={130+f*110} x2={316+i%6*21} y2={138+f*110} stroke="#4b89ac" strokeWidth="2" opacity={Math.min(1,flux.rain)}/>;})}
 {flux.runoff>0&&<circle cx={420-((clock.time*0.15)%1)*96} cy={295+((clock.time*0.15)%1)*25} r="5" fill="#eaf5ed"/>}
 <Arrow x1={155} y1={245} x2={209} y2={150} color={stage===0?'#be633c':'#90a795'}/><Arrow x1={245} y1={134} x2={301} y2={104} color={stage===1?'#be633c':'#90a795'}/><Arrow x1={481} y1={122} x2={481} y2={199} color={stage===2?'#be633c':'#90a795'}/><Arrow x1={510} y1={315} x2={440} y2={325} color={stage===3?'#be633c':'#90a795'}/>
 <text x="70" y="215">ระเหย ↑</text><text x="214" y="75">ควบแน่น →</text><text x="506" y="139">ฝน ↓</text><text x="514" y="305">ไหลกลับ / ซึมลงดิน</text><text x="70" y="312">แหล่งน้ำ</text>
 {amounts.map(([name,amount,color],i)=><g key={name}><rect x={20+i*174} y="348" width="160" height="8" rx="4" fill="#e3e9dc"/><rect x={20+i*174} y="348" width={amount*1.6} height="8" rx="4" fill={color}/><text x={20+i*174} y="380">{name} {amount.toFixed(1)}</text></g>)}
 </Frame>
 <div className="observe-strip" aria-live="polite"><strong>{stages[stage].name}</strong><p>{stages[stage].text}</p></div>
 <div className="sim-explanation"><details><summary>ลองทาย: แดดมากแล้วฝนต้องมากทันทีไหม?</summary><p>ไม่จำเป็น แดดมากช่วยการระเหย แต่การเกิดเมฆและฝนยังขึ้นกับความชื้น การเย็นตัว การยกตัวของอากาศ และการเติบโตของหยดน้ำ ลองเพิ่มแดด แต่ตั้งการเย็นตัวเป็นศูนย์ แล้วดูน้ำในแต่ละส่วน</p></details><details><summary>แบบจำลองนี้ยังไม่แสดงอะไรบ้าง?</summary><p>ระบบจริงมีลม การคายน้ำของพืช หิมะ น้ำแข็ง น้ำใต้ดิน และการแลกเปลี่ยนกับพื้นที่อื่น แบบจำลองนี้รวมทางน้ำบนดินและใต้ดินไว้ด้วยกัน และใช้เกณฑ์น้ำในเมฆอย่างง่ายแทนกระบวนการเกิดฝนจริง</p></details></div>
 </>;
}
