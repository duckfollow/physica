import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Lesson } from "../src/content/lessons.ts";
const lessons: Lesson[] = JSON.parse(readFileSync(new URL("../src/content/lessons.json", import.meta.url), "utf8"));
const expected: Record<string, string[]> = {
  elementary: ["ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6"],
  "middle-school": ["ม.1", "ม.2", "ม.3"],
  "high-school": ["ม.4", "ม.5", "ม.6"],
  university: ["ปี 1", "ปี 2", "ปี 3", "ปี 4"],
};
test("curriculum covers all sixteen recommended years with unique exportable routes", () => {
  assert.equal(lessons.length, 80);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  for (const [level, years] of Object.entries(expected)) {
    assert.deepEqual([...new Set(lessons.filter((lesson) => lesson.level === level).map((lesson) => lesson.year))], years);
  }
  for (const lesson of lessons) {
    assert.ok(expected[lesson.level]?.includes(lesson.year), lesson.id);
    assert.match(lesson.id, /^[a-z][a-z0-9-]+$/);
  }
});
test("every published lesson includes original content, a worked example, an answer and an activity", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.paragraphs.length >= 2, lesson.id);
    assert.ok(lesson.example.steps.length >= 2, lesson.id);
    const required = [lesson.title, lesson.goal, ...lesson.paragraphs, lesson.formula,
      lesson.example.question, ...lesson.example.steps, lesson.exercise.question,
      lesson.exercise.answer, lesson.activity, lesson.misconception];
    for (const value of required) {
      assert.equal(typeof value, "string", lesson.id);
      assert.ok(value.trim().length > 0, lesson.id);
      assert.doesNotMatch(value, /TODO|lorem ipsum|coming soon|เนื้อหาจะเพิ่มเติม/i, lesson.id);
    }
  }
});
test("each level starts and ends in its own contiguous learning path", () => {
  const order = Object.keys(expected);
  const indexes = lessons.map((lesson) => order.indexOf(lesson.level));
  assert.deepEqual(indexes, [...indexes].sort((a, b) => a - b));
});
