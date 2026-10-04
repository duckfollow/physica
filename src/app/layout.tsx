import type { Metadata } from "next";
import Link from "next/link";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";
export const metadata: Metadata = rootMetadata();
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body><a className="skip" href="#main">ข้ามไปเนื้อหา</a><header><Link className="brand" href="/">✳ <span>Physica</span></Link><nav aria-label="เมนูหลัก"><Link href="/learn/">เลือกตามระดับ</Link><Link href="/simulations/">คลังการจำลอง</Link><Link href="/tutor/">AI tutor <small>เร็ว ๆ นี้</small></Link></nav></header><main id="main">{children}</main><footer><strong>Physica</strong><span>Explore → Experiment → Understand</span><span>พื้นที่เล็ก ๆ สำหรับคำถามที่ยิ่งใหญ่</span></footer></body></html>;
}
