import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { siteDescription } from "@/lib/site";

export const dynamic = "force-static";
export const alt = "Physica — เรียนรู้ผ่านการทดลอง";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return ogCard({
    eyebrow: "SEE · CHANGE · UNDERSTAND",
    title: "Physica",
    subtitle: siteDescription,
  });
}
