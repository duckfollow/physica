import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { simulations } from "@/content/simulations";
import { LabShell } from "@/components/simulation/lab-shell";
import { VisualLab } from "@/components/simulation/visual-labs";
import { pageMetadata } from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams(){return simulations.filter(s=>s.id!=="projectile").map(s=>({simulation:s.id}));}
type Props={params:Promise<{simulation:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {simulation}=await params;
  const data=simulations.find(s=>s.id===simulation);
  if(!data) return {title:"ไม่พบการจำลอง"};
  return pageMetadata(data.title, data.question, `/simulations/${data.id}/`);
}
export default async function SimulationPage({params}:Props){const {simulation}=await params;const data=simulations.find(s=>s.id===simulation);if(!data||data.id==="projectile")notFound();return <section className="simulation-route"><Link className="text-link" href="/simulations/">← เลือกการจำลองอื่น</Link><LabShell simulation={data}><VisualLab id={data.id}/></LabShell></section>;}
