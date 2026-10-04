"use client";
import { useState, useRef, type ReactNode } from "react";
import type { Simulation } from "@/content/simulations";
export function LabShell({simulation,children}:{simulation:Simulation;children:ReactNode}) {
 const [presentation,setPresentation]=useState(false);const panel=useRef<HTMLDivElement>(null);
 return <div className={presentation?"simulation-page presentation-mode":"simulation-page"} ref={panel}><div className="simulation-heading"><div><p className="eyebrow">{simulation.topic} / INTERACTIVE LAB</p><h1>{simulation.title}</h1><p>{simulation.question}</p></div><button className="mode-button" aria-pressed={presentation} onClick={()=>{setPresentation(!presentation);panel.current?.scrollIntoView({block:"start"});}}>{presentation?"ออกจากโหมดสื่อการสอน":"ขยายสื่อการสอน ⤢"}</button></div>{children}<div className="observe-strip"><strong>ลองสังเกต</strong><p>{simulation.observe}</p></div><div className="sim-explanation"><details><summary>ทำไมจึงเป็นแบบนี้? · ทฤษฎีสั้น ๆ</summary><p>{simulation.theory}</p><p className="formula">{simulation.formula}</p><a href={simulation.source} target="_blank" rel="noreferrer">อ่านที่มาของแบบจำลอง ↗</a></details><details><summary>คำถามชวนทดลอง</summary><p>{simulation.challenge}</p></details></div><p className="model-note"><strong>ขอบเขตแบบจำลอง:</strong> {simulation.assumptions}</p></div>;
}
