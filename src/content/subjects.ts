export const SUBJECTS = ["ฟิสิกส์", "ชีววิทยา", "เคมี", "คณิตศาสตร์", "คอมพิวเตอร์", "โลกและอวกาศ"] as const;
export type Subject = (typeof SUBJECTS)[number];

/** Topics that belong to each subject (for filters and cover colors). */
const BIOLOGY = new Set([
  "ชีววิทยา",
  "เซลล์",
  "ชีวเคมี",
  "พืช",
  "พันธุศาสตร์",
  "นิเวศวิทยา",
]);

const CHEMISTRY = new Set([
  "เคมี",
  "ตารางธาตุ",
  "พันธะเคมี",
  "กรด–เบส",
  "จลนศาสตร์และสมดุล",
  "แก๊ส",
]);

const MATH = new Set([
  "คณิตศาสตร์",
  "กราฟและฟังก์ชัน",
  "ตรีโกณมิติ",
  "ความน่าจะเป็น",
  "แคลคูลัสเบื้องต้น",
]);

const COMPUTER = new Set([
  "คอมพิวเตอร์",
  "การสื่อสารข้อมูล",
]);

export function subjectOf(topic: string): Subject {
  if (topic === "โครงสร้างโลก" || topic === "วัฏจักรน้ำ") return "โลกและอวกาศ";
  if (COMPUTER.has(topic)) return "คอมพิวเตอร์";
  if (BIOLOGY.has(topic)) return "ชีววิทยา";
  if (CHEMISTRY.has(topic)) return "เคมี";
  if (MATH.has(topic)) return "คณิตศาสตร์";
  return "ฟิสิกส์";
}

export function coverSubjectOf(topic: string): "physics" | "biology" | "chemistry" | "math" {
  const s = subjectOf(topic);
  if (s === "ชีววิทยา") return "biology";
  if (s === "เคมี") return "chemistry";
  if (s === "คณิตศาสตร์") return "math";
  return "physics";
}
