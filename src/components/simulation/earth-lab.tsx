"use client";
import { useState } from 'react';
import { Frame, Slider } from './lab-primitives';
import { EARTH_RADIUS, earthLayers, earthBounds, earthLayerAt } from '@/simulations/earth';

export function EarthLab(){
 const [depth,setDepth]=useState(0),[ocean,setOcean]=useState(false),[expanded,setExpanded]=useState(true);
 const bounds=earthBounds(ocean),selected=earthLayerAt(depth,ocean),layer=earthLayers[selected];
 const radii=expanded?[164,150,89,31,0]:bounds.map(d=>(EARTH_RADIUS-d)/EARTH_RADIUS*164);
 const portion=(depth-bounds[selected])/(bounds[selected+1]-bounds[selected]);
 const marker=radii[selected]+portion*(radii[selected+1]-radii[selected]);
 return <><Frame title="สำรวจโลกจากผิวถึงศูนย์กลาง" stats={[["ความลึกจากผิว",`${depth.toLocaleString()} km`],["อยู่ในชั้น",layer.name],["สถานะ",layer.state]]} controls={<>
 <label htmlFor="earth-crust">บริเวณเปลือกโลก</label><select id="earth-crust" value={ocean?'ocean':'continent'} onChange={e=>setOcean(e.target.value==='ocean')}><option value="continent">ทวีป · ตัวอย่างหนา 35 km</option><option value="ocean">มหาสมุทร · ตัวอย่างหนา 7 km</option></select>
 <Slider label="ความลึกที่สำรวจ" min={0} max={EARTH_RADIUS} value={depth} unit="km" onChange={setDepth}/>
 <label className="check-label"><input type="checkbox" checked={expanded} onChange={e=>setExpanded(e.target.checked)}/> ขยายเปลือกโลกให้เห็นชัด</label>
 <div className="playback">{earthLayers.map((l,i)=><button key={l.name} className="mode-button" aria-pressed={selected===i} onClick={()=>setDepth(Math.round((bounds[i]+bounds[i+1])/2))}>{i+1}. {l.name}</button>)}</div>
 <p className="hint">{expanded?'ภาพขยายความหนาเปลือกโลก ไม่ได้ใช้สัดส่วนจริง':'ภาพใช้สัดส่วนรัศมีจริง เปลือกโลกจึงบางมาก'}</p>
 </>} note="ขอบชั้นเป็นค่าประมาณ โลกจริงไม่เป็นทรงกลมสมบูรณ์และขอบชั้นไม่สม่ำเสมอ · ใช้ปุ่มเลือกชั้นหรือเลื่อนความลึกเพื่อสำรวจ">
 {earthLayers.map((l,i)=><circle key={l.name} cx="220" cy="195" r={radii[i]} fill={l.color}/>)}
 <line x1="220" y1="195" x2="384" y2="195" stroke="#294d3b" strokeDasharray="3 3"/>
 <circle cx={220+marker} cy="195" r="6" fill="#fff" stroke="#173b2c" strokeWidth="3"/>
 <text x="220" y="382" textAnchor="middle">ผิวโลก → จุดสำรวจสีขาว → ศูนย์กลาง</text>
 {earthLayers.map((l,i)=><g key={l.name} opacity={selected===i?1:0.65}><rect x="425" y={62+i*70} width="14" height="14" rx="3" fill={l.color}/><text x="451" y={75+i*70} style={{fontWeight:selected===i?700:400}}>{l.name}</text><text x="451" y={97+i*70}>{bounds[i].toLocaleString()}–{bounds[i+1].toLocaleString()} km</text></g>)}
 <text x="420" y="368">รัศมีโลก ≈ 6,371 km</text>
 </Frame>
 <div className="observe-strip" aria-live="polite"><strong>{layer.name}</strong><div><p>{layer.detail}</p><p>องค์ประกอบ: {layer.material} · ความหนาในแบบจำลอง {(bounds[selected+1]-bounds[selected]).toLocaleString()} km</p></div></div>
 <div className="sim-explanation"><details><summary>ทำไมแก่นชั้นในแข็ง แต่แก่นชั้นนอกเหลว?</summary><p>สถานะของสสารขึ้นกับทั้งอุณหภูมิ ความดัน และองค์ประกอบ แก่นชั้นในอยู่ภายใต้ความดันสูงกว่ามาก จึงยังเป็นของแข็งแม้ร้อนกว่าแก่นชั้นนอก</p></details><details><summary>เปลือกโลกเหมือนธรณีภาคไหม?</summary><p>ไม่เหมือนกัน ธรณีภาครวมเปลือกโลกและเนื้อโลกส่วนบนสุดที่แข็งเกร็ง ส่วนฐานธรณีภาคเป็นบริเวณเนื้อโลกที่เปลี่ยนรูปได้ง่ายกว่า การแบ่งตามสมบัติเชิงกลจึงต่างจากการแบ่งองค์ประกอบ</p></details><details><summary>เรารู้ได้อย่างไร ทั้งที่ยังเจาะไม่ถึง?</summary><p>นักวิทยาศาสตร์ใช้การเดินทาง การสะท้อน และการหักเหของคลื่นไหวสะเทือน ร่วมกับข้อมูลแรงโน้มถ่วง สนามแม่เหล็ก และการทดลองวัสดุที่ความดันสูง โดยคลื่น S ไม่เดินทางผ่านของเหลว</p></details><details><summary>ภารกิจ: ลึก 3,000 km อยู่ชั้นไหน?</summary><p>ลองเลื่อนความลึกก่อนเปิดคำตอบ</p><details><summary>เปิดเฉลย</summary><p>แก่นโลกชั้นนอก เป็นของเหลว เริ่มประมาณ 2,900 km จากผิวโลก</p></details></details></div>
 </>;
}
