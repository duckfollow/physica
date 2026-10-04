import { simulations } from "@/content/simulations";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Physica simulation";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return simulations.filter((s) => s.id !== "projectile").map((s) => ({ simulation: s.id }));
}

type Props = { params: Promise<{ simulation: string }> };

export default async function Image({ params }: Props) {
  const { simulation } = await params;
  const data = simulations.find((s) => s.id === simulation);
  return ogCard({
    eyebrow: data?.topic ?? "Physica",
    title: data?.title ?? "การจำลอง",
    subtitle: data?.question ?? "ปรับตัวแปรแล้วดูผล",
  });
}
