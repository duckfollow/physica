import Link from "next/link";
import { simulations } from "@/content/simulations";
import { LabShell } from "@/components/simulation/lab-shell";
import { ProjectileLab } from "@/components/simulation/projectile-lab";
export const metadata={title:"ยิงมุมไหน ไปได้ไกลที่สุด?"};
export default function ProjectilePage(){const data=simulations.find(s=>s.id==="projectile")!;return <section className="simulation-route"><Link className="text-link" href="/simulations/">← เลือกการจำลองอื่น</Link><LabShell simulation={data}><ProjectileLab/></LabShell></section>;}
