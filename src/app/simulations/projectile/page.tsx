import Link from "next/link";
import { simulations } from "@/content/simulations";
import { LabShell } from "@/components/simulation/lab-shell";
import { ProjectileLab } from "@/components/simulation/projectile-lab";
import { pageMetadata } from "@/lib/seo";
const projectile=simulations.find(s=>s.id==="projectile")!;
export const metadata=pageMetadata(projectile.title, projectile.question, "/simulations/projectile/");
export default function ProjectilePage(){return <section className="simulation-route"><Link className="text-link" href="/simulations/">← เลือกการจำลองอื่น</Link><LabShell simulation={projectile}><ProjectileLab/></LabShell></section>;}
