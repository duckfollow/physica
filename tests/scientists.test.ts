import test from "node:test";
import assert from "node:assert/strict";
import {
  torricelliColumn,
  youngFringes,
  youngIntensity,
  rutherfordScatter,
  rutherfordHistogram,
} from "../src/simulations/scientists.ts";

const near = (a: number, b: number, t = 1e-6) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("torricelli mercury column is about 760 mm at 1 atm", () => {
  const c = torricelliColumn(101_325, 13_600);
  near(c.heightMm, 760, 5);
  const lower = torricelliColumn(90_000, 13_600);
  assert.ok(lower.height < c.height);
  const water = torricelliColumn(101_325, 1000);
  assert.ok(water.height > 10);
});

test("young fringe spacing scales with λ and 1/d", () => {
  const a = youngFringes(500, 0.2, 1);
  const b = youngFringes(1000, 0.2, 1);
  const c = youngFringes(500, 0.4, 1);
  near(b.spacing, 2 * a.spacing);
  near(c.spacing, a.spacing / 2);
  near(youngIntensity(0, 500, 0.2, 1), 1, 1e-9);
  assert.ok(youngIntensity(a.spacing / 2, 500, 0.2, 1) < 0.05);
});

test("rutherford angle grows as impact parameter shrinks", () => {
  const far = rutherfordScatter(60, 5);
  const nearHit = rutherfordScatter(5, 5);
  assert.ok(nearHit.thetaDeg > far.thetaDeg);
  assert.ok(nearHit.thetaDeg > 20);
  const head = rutherfordScatter(0.01, 5);
  assert.ok(head.thetaDeg > 150);
  const hist = rutherfordHistogram(5, 200, 400, 12);
  assert.equal(hist.counts.reduce((s, n) => s + n, 0), 200);
  const lowAngle = hist.counts.slice(0, 3).reduce((s, n) => s + n, 0);
  const highAngle = hist.counts.slice(-3).reduce((s, n) => s + n, 0);
  assert.ok(lowAngle > highAngle);
});
