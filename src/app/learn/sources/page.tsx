import Link from "next/link";
import { simulations } from "@/content/simulations";
export const metadata={title:"ที่มาของแบบจำลอง"};
export default function Sources(){return <section className="reading"><Link className="text-link" href="/simulations/">← คลังการจำลอง</Link><h1>ทฤษฎีที่อยู่เบื้องหลังภาพ</h1><p className="intro">แต่ละการจำลองใช้แบบจำลองเฉพาะ พร้อมระบุเงื่อนไขที่ใช้ได้</p>{simulations.map(s=><article className="source-card" key={s.id}><h2>{s.title}</h2><p>{s.theory}</p><p>{s.assumptions}</p><a href={s.source} target="_blank" rel="noreferrer">อ่านอ้างอิงทางฟิสิกส์ ↗</a></article>)}</section>;}
