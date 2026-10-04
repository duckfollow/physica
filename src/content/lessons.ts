import data from "./lessons.json";
import type { LevelId } from "./curriculum";

export interface Lesson {
  id: string;
  level: LevelId;
  year: string;
  topic: string;
  title: string;
  goal: string;
  paragraphs: string[];
  formula: string;
  example: { question: string; steps: string[] };
  exercise: { question: string; answer: string };
  activity: string;
  misconception: string;
}
export const lessons = data as Lesson[];
export const lessonHref = (lesson: Pick<Lesson, "level" | "id">) =>
  `/learn/${lesson.level}/${lesson.id}/`;
export const lessonsForLevel = (level: string) => lessons.filter((lesson) => lesson.level === level);
export const yearsForLevel = (level: string) => [...new Set(lessonsForLevel(level).map((lesson) => lesson.year))];
export const levelPrerequisites: Record<LevelId, string> = {
  elementary: "เริ่มได้จากการสังเกตและนับจำนวน ช่วงหลังใช้การบวก ลบ คูณ หาร ผู้เรียนเล็กอ่านร่วมกับผู้ใหญ่ได้",
  "middle-school": "ทบทวนหน่วย การคูณหาร เศษส่วน อัตราส่วน และการอ่านกราฟจากระดับประถม",
  "high-school": "ใช้พีชคณิต กราฟ สมการกำลังสอง และตรีโกณมิติ บทแรกช่วยเริ่มเรื่องเวกเตอร์",
  university: "ควรผ่านฟิสิกส์มัธยมปลาย ปี 1 เริ่มแคลคูลัส จากนั้นใช้อนุพันธ์ย่อย สมการเชิงอนุพันธ์ จำนวนเชิงซ้อน และพีชคณิตเชิงเส้น ควรเรียนคณิตศาสตร์เหล่านี้ควบคู่กับบทฟิสิกส์",
};
export interface ReadingSource { title: string; url: string; description: string }
export const readingSources: ReadingSource[] = [
  { title: "สสวท. — ฟิสิกส์และเอกสารหลักสูตร", url: "https://www.ipst.ac.th/physics", description: "ใช้เทียบกรอบเนื้อหาระดับโรงเรียน ไม่ใช่การรับรองว่าลำดับปีใน Physica ตรงตัวชี้วัดทุกข้อ" },
  { title: "OpenStax — University Physics Volume 1", url: "https://openstax.org/books/university-physics-volume-1/pages/preface", description: "อ่านต่อเรื่องการวัด กลศาสตร์ การหมุน ของไหล การสั่น และคลื่น" },
  { title: "OpenStax — University Physics Volume 2", url: "https://openstax.org/books/university-physics-volume-2/pages/preface", description: "อ่านต่อเรื่องอุณหพลศาสตร์ ไฟฟ้า แม่เหล็ก และวงจร" },
  { title: "OpenStax — University Physics Volume 3", url: "https://openstax.org/books/university-physics-volume-3/pages/preface", description: "อ่านต่อเรื่องแสง สัมพัทธภาพ ควอนตัม ของแข็ง นิวเคลียร์ และจักรวาลวิทยา" },
  { title: "MIT — Physics undergraduate curriculum", url: "https://catalog.mit.edu/degree-charts/physics-course-8/", description: "ใช้เทียบขอบเขตแกนหลักระดับปริญญาตรีและบทบาทของปฏิบัติการกับโครงงาน" },
  { title: "MIT OCW — Classical Mechanics III", url: "https://ocw.mit.edu/courses/8-09-classical-mechanics-iii-fall-2014/", description: "กลศาสตร์ลากรางจ์ แฮมิลตัน และระบบไม่เชิงเส้น" },
  { title: "MIT OCW — Quantum Physics I", url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/syllabus/", description: "เส้นทางศึกษาควอนตัมพร้อมความรู้พื้นฐานที่ควรมีก่อน" },
  { title: "MIT OCW — Statistical Physics I", url: "https://ocw.mit.edu/courses/8-044-statistical-physics-i-spring-2013/", description: "ความน่าจะเป็น อุณหพลศาสตร์ และฟิสิกส์สถิติ" },
  { title: "TU Delft — Perturbation theory", url: "https://interactivetextbooks.tudelft.nl/introduction-to-quantum-mechanics/content/perturbationtheory.html", description: "การประมาณพลังงานควอนตัมด้วยทฤษฎีรบกวน" },
  { title: "UC Berkeley — Exploring Chaos with the Logistic Map", url: "https://problembank.berkeley.edu/77/", description: "กิจกรรมศึกษาการวนซ้ำและความไวต่อเงื่อนไขเริ่มต้น" },
  { title: "MIT OCW — Numerical Computation", url: "https://ocw.mit.edu/courses/2-086-numerical-computation-for-mechanical-engineers-fall-2012/", description: "วิธีเชิงตัวเลข การสุ่ม และการตรวจความคลาดเคลื่อน" },
  { title: "MIT OCW — Experimental Physics Junior Lab", url: "https://ocw.mit.edu/courses/8-13-14-experimental-physics-i-ii-junior-lab-fall-2016-spring-2017/", description: "แนวทางปฏิบัติการ การวิเคราะห์ และการสื่อสารผลการทดลอง" },
];
export function sourcesForLesson(lesson: Lesson): ReadingSource[] {
  if (lesson.level === "elementary") return [readingSources[0]];
  const ids: Record<string, number[]> = {
    "numerical-euler": [10], "monte-carlo": [10], "fitting-data": [11], "uncertainty-lab": [11], "research-project": [11],
    "lagrange-hamilton": [5], "quantum-operators": [6], "angular-spin": [6],
    "wavefunction": [6, 3], "schrodinger-well": [6, 3], perturbation: [8],
    ensembles: [7], "quantum-statistics": [7], "phase-transitions": [7],
    chaos: [9, 5], "solid-state": [3], particles: [3], astrophysics: [3],
    "measurement-electronics": [2, 3], "maxwell": [2], "electrodynamic-energy": [2],
    "continuous-charge": [2], "rc-circuits": [2], "current-circuits": [2],
    "electric-field": [2], "capacitors-dc": [2], "magnetic-induction": [2], "ac-emwaves": [2],
    "photons-atoms": [3], nuclear: [3], relativity: [3], "polarization-optics": [3],
    "wave-optics": [3], refraction: [3], entropy: [2], thermodynamics: [2],
    "heat-transfer": [2], "thermal-energy": [2], "particle-model": [2],
  };
  return (ids[lesson.id] ?? [1]).map((index) => readingSources[index]);
}
