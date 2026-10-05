import { AtomArt } from "@/components/atom-art";
import { simulations } from "@/content/simulations";
import Link from "next/link";
import { SimulationCatalog } from "@/components/simulation/simulation-catalog";

const starters = [
  { href: "/simulations/wave/", label: "ลองคลื่น" },
  { href: "/simulations/osmosis/", label: "ลองเซลล์" },
  { href: "/simulations/linear/", label: "ลองกราฟ" },
] as const;

export default function Home() {
  const topics = new Set(simulations.map((s) => s.topic)).size;
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">SEE · CHANGE · UNDERSTAND</p>
          <h1>
            Physica
            <br />
            <em>เห็นแล้วลองเอง จึงเข้าใจ</em>
          </h1>
          <p className="intro">
            ฟิสิกส์ ชีววิทยา เคมี และคณิตศาสตร์
            <br />
            เปลี่ยนตัวแปร แล้วค้นหาคำตอบจากภาพตรงหน้า
          </p>
          <div className="actions">
            <Link className="button" href="/simulations/">
              เลือกการจำลอง ↗
            </Link>
            <Link className="text-link" href="/learn/">
              เลือกตามระดับผู้เรียน →
            </Link>
          </div>
          <p className="hero-note">
            ใช้สอนหน้าห้อง หรือทดลองด้วยตัวเอง · {simulations.length} การจำลอง · ไม่ต้องสมัครสมาชิก
          </p>
          <div className="starter-links">
            {starters.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <AtomArt />
      </section>
      <section className="home-labs">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE VISUAL LAB</p>
            <h2>อยากเห็นอะไรเกิดขึ้น?</h2>
          </div>
          <span className="muted">
            {simulations.length} การจำลอง · {topics} หมวด
          </span>
        </div>
        <SimulationCatalog />
      </section>
      <section className="feature">
        <div>
          <p className="eyebrow">MADE FOR LEARNING</p>
          <h2>ทายก่อน · ลองปรับ · อธิบายสิ่งที่เห็น</h2>
          <p>
            แต่ละการทดลองมีคำถามชวนสังเกต ทฤษฎีสั้น ๆ และนักวิทยาศาสตร์ที่เกี่ยวข้อง
            เปิดอ่านได้เมื่ออยากรู้เหตุผล
          </p>
        </div>
        <Link className="button light" href="/simulations/">
          เปิดคลังการจำลอง →
        </Link>
      </section>
    </>
  );
}
