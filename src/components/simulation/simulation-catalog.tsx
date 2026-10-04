"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { levels, type LevelId } from "@/content/curriculum";
import { simulations, simulationHref, type Simulation } from "@/content/simulations";
import { SimCover } from "./sim-cover";

const SUBJECTS = ["ฟิสิกส์", "ชีววิทยา", "เคมี", "คณิตศาสตร์"] as const;
type Subject = (typeof SUBJECTS)[number];

function subjectOf(topic: string): Subject {
  if (topic === "ชีววิทยา" || topic === "เคมี" || topic === "คณิตศาสตร์") return topic;
  return "ฟิสิกส์";
}

const STARTER_IDS = new Set(["wave", "osmosis", "acid-base", "linear", "force", "projectile"]);

export function SimulationCatalog({ initialLevel = "all" }: { initialLevel?: LevelId | "all" }) {
  const [level, setLevel] = useState<string>(initialLevel);
  const [subject, setSubject] = useState<Subject | "all">("all");
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const topics = useMemo(() => [...new Set(simulations.map((s) => s.topic))].sort((a, b) => a.localeCompare(b, "th")), []);

  const visible = simulations.filter((s) => {
    const matchLevel = level === "all" || s.levels.includes(level as LevelId);
    const matchSubject = subject === "all" || subjectOf(s.topic) === subject;
    const matchTopic = topic === "all" || s.topic === topic;
    const q = query.trim();
    const matchQuery = !q || `${s.title} ${s.topic} ${s.question}`.includes(q);
    return matchLevel && matchSubject && matchTopic && matchQuery;
  });

  const grouped = SUBJECTS.map((name) => ({
    name,
    items: visible.filter((s) => subjectOf(s.topic) === name),
  })).filter((group) => group.items.length > 0);

  const showGroups = subject === "all" && topic === "all" && !query.trim();

  function reset() {
    setQuery("");
    setLevel("all");
    setSubject("all");
    setTopic("all");
  }

  return (
    <div className="sim-catalog">
      <div className="catalog-tools">
        <label className="search-field">
          อยากทดลองเรื่องอะไร?
          <input type="search" value={query} placeholder="เช่น กราฟ แสง เซลล์ หรือกรด" onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label>
          วิชา
          <select value={subject} onChange={(e) => { setSubject(e.target.value as Subject | "all"); setTopic("all"); }}>
            <option value="all">ทุกวิชา</option>
            {SUBJECTS.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          ระดับผู้เรียน
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">ทุกระดับ</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>{l.range}</option>
            ))}
          </select>
        </label>
        <label>
          หัวข้อย่อย
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">ทุกหัวข้อ</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="catalog-status">
        <p className="muted" role="status">
          {visible.length} การจำลองพร้อมทดลอง · ป้าย “แนะนำ” คือจุดเริ่มต้นที่ดี
        </p>
        {(query || level !== "all" || subject !== "all" || topic !== "all") && (
          <button className="mode-button" type="button" onClick={reset}>ล้างตัวกรอง</button>
        )}
      </div>
      {showGroups ? (
        grouped.map((group) => (
          <section className="catalog-group" key={group.name}>
            <div className="section-heading">
              <h2>{group.name}</h2>
              <span className="muted">{group.items.length} เรื่อง</span>
            </div>
            <CardGrid items={group.items} />
          </section>
        ))
      ) : (
        <CardGrid items={visible} />
      )}
      {visible.length === 0 && (
        <div className="panel">
          <h2>ไม่พบการจำลองที่ตรงกัน</h2>
          <button className="button" onClick={reset}>แสดงทั้งหมด</button>
        </div>
      )}
    </div>
  );
}

function CardGrid({ items }: { items: Simulation[] }) {
  return (
    <div className="sim-grid">
      {items.map((s) => (
        <Link href={simulationHref(s.id)} key={s.id} className="sim-card">
          <SimCover id={s.id} topic={s.topic} />
          <div className="sim-card-body">
            <p className="eyebrow">
              {s.topic}
              {STARTER_IDS.has(s.id) ? " · แนะนำ" : ""}
            </p>
            <h2>{s.title}</h2>
            <p>{s.question}</p>
            <div className="sim-levels">
              {s.levels.map((id) => (
                <span key={id}>{levels.find((l) => l.id === id)?.range}</span>
              ))}
            </div>
            <strong>เปิดการจำลอง ↗</strong>
          </div>
        </Link>
      ))}
    </div>
  );
}
