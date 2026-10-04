import { simulations } from "@/content/simulations";
import { SimulationCatalog } from "@/components/simulation/simulation-catalog";

export const metadata = { title: "คลังสื่อจำลอง" };

export default function Simulations() {
  return (
    <section>
      <p className="eyebrow">EXPLORE · CHANGE · DISCOVER</p>
      <h1>เห็นแล้วลอง เข้าใจได้ด้วยตัวเอง</h1>
      <p className="intro">
        ฟิสิกส์ ชีววิทยา เคมี และคณิตศาสตร์ · {simulations.length} การจำลอง
        <br />
        เลือกสิ่งที่สงสัย ปรับตัวแปร แล้วสังเกตสิ่งที่เปลี่ยนไป
      </p>
      <SimulationCatalog />
    </section>
  );
}
