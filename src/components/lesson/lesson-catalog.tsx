"use client";

import { useState } from "react";
import Link from "next/link";
import { levels, type LevelId } from "@/content/curriculum";
import { lessons, lessonHref } from "@/content/lessons";
import { useCompletedLessons } from "./lesson-progress";

export function LessonCatalog({ fixedLevel }: { fixedLevel?: LevelId }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>(fixedLevel ?? "all");
  const [year, setYear] = useState("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const completed = useCompletedLessons();
  const base = lessons.filter((lesson) => level === "all" || lesson.level === level);
  const years = [...new Set(base.map((lesson) => lesson.year))];
  const normalizedQuery = query.trim().toLocaleLowerCase("th");
  const visible = base.filter((lesson) =>
    (year === "all" || lesson.year === year) &&
    (!onlyUnread || !completed.includes(lesson.id)) &&
    `${lesson.title} ${lesson.topic} ${lesson.goal} ${lesson.formula} ${lesson.year}`.toLocaleLowerCase("th").includes(normalizedQuery),
  );
  const countDone = base.filter((lesson) => completed.includes(lesson.id)).length;
  function reset() { setQuery(""); setLevel(fixedLevel ?? "all"); setYear("all"); setOnlyUnread(false); }
  return <div className="catalog">
    <div className="catalog-tools">
      <label className="search-field">ค้นหาบทเรียน
        <input type="search" placeholder="เช่น แรง แสง ควอนตัม หรือชื่อบท…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {!fixedLevel && <label>ระดับ
        <select value={level} onChange={(event) => { setLevel(event.target.value); setYear("all"); }}>
          <option value="all">ทุกระดับ</option>
          {levels.map((item) => <option key={item.id} value={item.id}>{item.range}</option>)}
        </select>
      </label>}
      <label>ปีเรียนแนะนำ
        <select value={year} onChange={(event) => setYear(event.target.value)}>
          <option value="all">ทุกปี</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
    <div className="catalog-status">
      <label className="check-label"><input type="checkbox" checked={onlyUnread} onChange={(event) => setOnlyUnread(event.target.checked)} /> เฉพาะบทที่ยังไม่ได้ทำเครื่องหมาย</label>
      <span>{countDone} / {base.length} บทที่เรียนแล้ว</span>
    </div>
    <p className="muted" role="status">พบ {visible.length} บทเรียน</p>
    {visible.length === 0 ? <div className="panel"><h3>ยังไม่พบบทเรียนที่ตรงกัน</h3><p>ลองใช้คำสั้นลง หรือเปลี่ยนระดับและปีเรียน</p><button className="button" type="button" onClick={reset}>ล้างตัวกรอง</button></div> :
      <div className="lesson-list">{visible.map((lesson) => <Link key={lesson.id} className="lesson-row" href={lessonHref(lesson)}>
        <span className="lesson-year">{lesson.year}</span>
        <div><h3>{lesson.title}</h3><p>{lesson.goal}</p><span className="muted">{lesson.topic}</span></div>
        <span className="lesson-state">{completed.includes(lesson.id) ? "✓ เรียนแล้ว" : "อ่านบทเรียน →"}</span>
      </Link>)}</div>}
  </div>;
}
