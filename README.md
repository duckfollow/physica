# Physica — Visual Physics Lab

สื่อจำลองฟิสิกส์ภาษาไทย เน้นการปรับตัวแปรแล้วเห็นผล พร้อมทฤษฎีสั้น ๆ เฉพาะสิ่งที่จำลอง

มี 8 การจำลอง: แรงและมวล, โพรเจกไทล์, ลูกตุ้ม, คลื่น, การหักเห, วงจรอนุกรม/ขนาน, อุณหภูมิสมดุลหลังผสมน้ำ และอนุภาคควอนตัมในกล่อง

## เริ่มใช้งาน

ใช้ Node.js 22.13+ รัน `npm ci` และ `npm run dev` แล้วเปิด http://localhost:3000

ตรวจด้วย `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`

## การใช้สอน

ให้ผู้เรียนทายผลก่อนปรับตัวแปร แล้วอธิบายสิ่งที่เห็น ทุกการจำลองมีคำถามชวนสังเกต ขอบเขตแบบจำลอง และทฤษฎีที่กดเปิดได้ ปุ่มขยายสื่อการสอนเพิ่มพื้นที่ภาพและซ่อนรายละเอียดทฤษฎี

การเคลื่อนไหวเริ่มด้วยปุ่มและหยุดได้ ส่วนการหักเห ความร้อน และควอนตัมเป็นภาพตอบสนองต่อตัวแปร ไม่แสดงการเคลื่อนไหวที่ขัดกับแบบจำลอง ระดับผู้เรียนเป็นคำแนะนำ ไม่ใช่หลักสูตรเต็มที่รับรอง

## โครงสร้าง

- `src/content/simulations.ts`: ทะเบียนสื่อ ทฤษฎี ข้อสมมติ แหล่งอ้างอิง
- `src/simulations/models.ts`: สมการแยกจาก UI
- `src/components/simulation/`: ภาพ SVG และตัวควบคุม
- `src/app/simulations/`: หน้า static ของแต่ละการจำลอง
- `src/app/learn/`: เลือกสื่อตามระดับ
- `src/content/lessons.json`: เก็บเนื้อหาเดิม 80 บทเป็นข้อมูลอ้างอิง ไม่สร้างหน้าบทอ่านแล้ว
- `src/lib/ai-tutor/`: contract สำหรับต่อ AI ภายหลัง

## GitHub Pages

ใช้ static export ไป `out/` และ Webpack เปิด Settings → Pages → GitHub Actions แล้ว push main หรือสั่ง workflow `Deploy Physica to GitHub Pages` ยังไม่ได้ push/deploy จากการปรับโค้ดครั้งนี้

Build project site ด้วย `NEXT_PUBLIC_BASE_PATH=/physica npm run build` ต้อง serve `out/` ใต้ `/physica/` ส่วน build ไม่ตั้ง env ใช้ root path ไม่มี `next start`

AI tutor ต้องเรียก backend ภายนอก ห้ามใส่ API key ใน browser หรือ NEXT_PUBLIC_* เพราะ GitHub Pages ไม่มี server runtime

## Dependencies

ผล audit ครั้งก่อนพบ 5 high ในสาย dependency ของ ESLint ส่วน production audit ไม่พบช่องโหว่ ไม่ force downgrade ข้าม major ควรติดตาม upstream patch
