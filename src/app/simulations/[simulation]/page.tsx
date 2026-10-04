import Link from "next/link";
import { notFound } from "next/navigation";
import { simulations } from "@/content/simulations";
import { LabShell } from "@/components/simulation/lab-shell";
import { VisualLab } from "@/components/simulation/visual-labs";
export const dynamicParams=false;
export function generateStaticParams(){return simulations.filter(s=>s.id!=="projectile").map(s=>({simulation:s.id}));}
type Props={params:Promise<{simulation:string}>};
export async function generateMetadata({params}:Props){const {simulation}=await params;return {title:simulations.find(s=>s.id===simulation)?.title??"ไม่พบการจำลอง"};}
export default async function SimulationPage({params}:Props){const {simulation}=await params;const data=simulations.find(s=>s.id===simulation);if(!data||data.id==="projectile")notFound();return <section className="simulation-route"><Link className="text-link" href="/simulations/">← เลือกการจำลองอื่น</Link><LabShell simulation={data}><VisualLab id={data.id}/></LabShell></section>;}
