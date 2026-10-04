export type LevelId = "elementary" | "middle-school" | "high-school" | "university";
export interface LearningLevel {
  id: LevelId;
  number: string;
  title: string;
  range: string;
  description: string;
  topics: string[];
}
export const levels: LearningLevel[] = [
  { id: "elementary", number: "01", title: "เริ่มต้นด้วยความสงสัย", range: "ประถมศึกษา", description: "สังเกตภาพ เปรียบเทียบสิ่งที่เปลี่ยน และลองอธิบายด้วยคำของตัวเอง", topics: ["แรงและการเคลื่อนที่", "แสงและเสียง", "พลังงานและวัสดุ", "ไฟฟ้าและโลก"] },
  { id: "middle-school", number: "02", title: "เปลี่ยนการสังเกตเป็นความเข้าใจ", range: "มัธยมต้น", description: "เปลี่ยนตัวแปรทีละอย่าง อ่านค่าจากภาพ และเชื่อมเหตุผล", topics: ["การวัดและความร้อน", "แรงและของไหล", "คลื่นและแสง", "วงจรและวงโคจร"] },
  { id: "high-school", number: "03", title: "มองเห็นสมการในธรรมชาติ", range: "มัธยมปลาย", description: "เชื่อมภาพจำลองกับสมการ กราฟ และเงื่อนไขของแบบจำลอง", topics: ["กลศาสตร์", "การสั่นและคลื่น", "อุณหพลศาสตร์", "ไฟฟ้าและแม่เหล็ก", "อะตอมและนิวเคลียร์"] },
  { id: "university", number: "04", title: "สำรวจให้ลึกกว่าเดิม", range: "ปริญญาตรี", description: "สำรวจแบบจำลองเชิงคณิตศาสตร์ ข้อจำกัด และความน่าจะเป็น", topics: ["คณิตศาสตร์ฟิสิกส์", "กลศาสตร์วิเคราะห์", "แม่เหล็กไฟฟ้า", "ควอนตัมและสถิติ", "ของแข็งและอนุภาค", "การคำนวณและงานวิจัย"] },
];
