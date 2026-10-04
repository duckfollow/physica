import test from "node:test";
import assert from "node:assert/strict";
import { threeBodyInitial, threeBodyPath, threeBodyEnergy } from "../src/simulations/three-body.ts";

test("figure-8 returns near the start after one period", () => {
  const period = 6.32591398;
  const dt = 0.002;
  const steps = Math.round(period / dt);
  const start = threeBodyInitial("figure8");
  const { trails, energyDrift } = threeBodyPath("figure8", steps, dt);
  assert.ok(energyDrift < 1e-4);
  for (let i = 0; i < 3; i++) {
    const end = trails[i].at(-1)!;
    assert.ok(Math.hypot(end.x - start[i].x, end.y - start[i].y) < 0.05);
  }
});

test("small perturbation diverges from the figure-8 path", () => {
  const steps = 8000;
  const base = threeBodyPath("figure8", steps, 0.002);
  const pert = threeBodyPath("perturbed", steps, 0.002);
  let maxGap = 0;
  for (let k = 0; k < base.trails[0].length; k++) {
    for (let i = 0; i < 3; i++) {
      maxGap = Math.max(
        maxGap,
        Math.hypot(base.trails[i][k].x - pert.trails[i][k].x, base.trails[i][k].y - pert.trails[i][k].y),
      );
    }
  }
  assert.ok(maxGap > 0.3);
});

test("lagrange keeps roughly equal pairwise distances", () => {
  const { trails } = threeBodyPath("lagrange", 2500, 0.002);
  const p = trails.map((t) => t.at(-1)!);
  const d01 = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  const d12 = Math.hypot(p[1].x - p[2].x, p[1].y - p[2].y);
  const d20 = Math.hypot(p[2].x - p[0].x, p[2].y - p[0].y);
  assert.ok(Math.abs(d01 - d12) < 0.08);
  assert.ok(Math.abs(d12 - d20) < 0.08);
});

test("energy helper is finite for all presets", () => {
  for (const preset of ["figure8", "lagrange", "hierarchical", "perturbed"] as const) {
    const e = threeBodyEnergy(threeBodyInitial(preset));
    assert.ok(Number.isFinite(e));
  }
});
