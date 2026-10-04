"use client";

import { useSyncExternalStore, useState } from "react";
const STORAGE_KEY = "physica.completed-lessons.v1";
const CHANGE_EVENT = "physica-progress-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
function snapshot() {
  try { return localStorage.getItem(STORAGE_KEY) ?? "[]"; } catch { return "[]"; }
}
function parseIds(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}
export function useCompletedLessons() {
  return parseIds(useSyncExternalStore(subscribe, snapshot, () => "[]"));
}
export function LessonProgress({ lessonId }: { lessonId: string }) {
  const completed = useCompletedLessons();
  const isCompleted = completed.includes(lessonId);
  const [error, setError] = useState("");
  function toggle() {
    try {
      // Read at interaction time to preserve changes made in other open tabs.
      const current = parseIds(snapshot());
      const next = current.includes(lessonId) ? current.filter((id) => id !== lessonId) : [...current, lessonId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
      setError("");
    } catch { setError("เบราว์เซอร์ไม่อนุญาตให้บันทึก แต่ยังอ่านบทเรียนต่อได้ตามปกติ"); }
  }
  return <div className="progress-control">
    <button type="button" className="button" aria-pressed={isCompleted} onClick={toggle}>
      {isCompleted ? "✓ เรียนบทนี้แล้ว · กดเพื่อยกเลิก" : "ทำเครื่องหมายว่าเรียนบทนี้แล้ว"}
    </button>
    <p className="muted">บันทึกเฉพาะเบราว์เซอร์นี้ ไม่ซิงก์ข้ามอุปกรณ์ และไม่ได้ประเมินคะแนน</p>
    <p role="status">{error}</p>
  </div>;
}
