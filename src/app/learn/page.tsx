import { SimulationCatalog } from "@/components/simulation/simulation-catalog";
import { LevelCards } from "@/components/lesson/level-cards";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata("เลือกสื่อจำลองตามระดับ","เลือกระดับผู้เรียนแล้วค้นหาการจำลองที่เหมาะสำหรับสอนหรือทดลองเอง","/learn/");
export default function Learn(){return <section><p className="eyebrow">LEARN THROUGH EXPLORATION</p><h1>เรื่องเดียวกัน เรียนรู้ได้หลายระดับ</h1><p className="intro">ฟิสิกส์ ชีวะ เคมี และคณิต · เริ่มจากดูสิ่งที่เปลี่ยนไป แล้วค่อยเชื่อมโยงกับกราฟและสมการ<br/>เลือกระดับเพื่อค้นหาการจำลองที่เหมาะกับผู้เรียน</p><LevelCards/><SimulationCatalog/></section>;}
