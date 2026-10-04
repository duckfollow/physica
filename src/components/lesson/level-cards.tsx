import Link from "next/link";
import { levels } from "@/content/curriculum";
import { simulations } from "@/content/simulations";
export function LevelCards(){return <div className="level-grid">{levels.map(l=><Link className="level-card" key={l.id} href={`/learn/${l.id}/`}><span className="number">{l.number} / {l.range}</span><h3>{l.title}</h3><p>{l.description}</p><span className="card-link">{simulations.filter(s=>s.levels.includes(l.id)).length} การจำลอง <span>เปิดดู ↗</span></span></Link>)}</div>;}
