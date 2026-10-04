import Link from "next/link";
import { TutorPlaceholder } from "@/components/ai-tutor/tutor-placeholder";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("AI tutor", "พื้นที่สำหรับ AI tutor ในอนาคตของ Physica", "/tutor/");
export default function Tutor() { return <section className="reading"><p className="eyebrow">YOUR FUTURE LEARNING COMPANION</p><h1>ทุกคำถาม มีพื้นที่ให้ค้นหา</h1><p className="intro">AI tutor · ฟีเจอร์สำหรับการพัฒนาในระยะถัดไป</p><TutorPlaceholder/><Link className="text-link" href="/simulations/">เลือกการจำลอง →</Link></section>; }
