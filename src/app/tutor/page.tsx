import Link from "next/link";
import { TutorPlaceholder } from "@/components/ai-tutor/tutor-placeholder";
export const metadata = { title: "AI tutor" };
export default function Tutor() { return <section className="reading"><p className="eyebrow">YOUR FUTURE LEARNING COMPANION</p><h1>ทุกคำถาม มีพื้นที่ให้ค้นหา</h1><p className="intro">AI tutor · ฟีเจอร์สำหรับการพัฒนาในระยะถัดไป</p><TutorPlaceholder/><Link className="text-link" href="/simulations/">เลือกการจำลอง →</Link></section>; }
