import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { levels } from "@/content/curriculum";
import { SimulationCatalog } from "@/components/simulation/simulation-catalog";
import { pageMetadata } from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams(){return levels.map(l=>({level:l.id}));}
export async function generateMetadata({params}:{params:Promise<{level:string}>}):Promise<Metadata>{
  const {level}=await params;
  const data=levels.find(l=>l.id===level);
  if(!data) return {title:"ไม่พบระดับ"};
  return pageMetadata(data.range, data.description, `/learn/${data.id}/`);
}
export default async function LevelPage({params}:{params:Promise<{level:string}>}){const {level}=await params;const data=levels.find(l=>l.id===level);if(!data)notFound();return <section><Link className="text-link" href="/learn/">← ทุกระดับ</Link><p className="eyebrow level-eyebrow">{data.range}</p><h1>{data.title}</h1><p className="intro">{data.description}</p><SimulationCatalog key={data.id} initialLevel={data.id}/></section>;}
