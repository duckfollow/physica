import { test } from "node:test";
import assert from "node:assert/strict";
import { osmosisCell, mixAcidBase, indicatorHue } from "../src/simulations/life-science.ts";

const near = (a: number, b: number, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

test("hypotonic surroundings swell the cell and hypertonic surroundings shrink it", () => {
  const swell = osmosisCell(0.4, 0.1, 5);
  const shrink = osmosisCell(0.1, 0.4, 5);
  const same = osmosisCell(0.25, 0.25, 5);
  assert.equal(swell.tonicity, "hypotonic");
  assert.equal(shrink.tonicity, "hypertonic");
  assert.equal(same.tonicity, "isotonic");
  assert.ok(swell.volume > 1.2);
  assert.ok(shrink.volume < 0.8);
  near(same.volume, 1, 1e-6);
  assert.equal(swell.outcome, "turgid");
  assert.equal(shrink.outcome, "plasmolyzed");
});

test("equal moles of strong acid and base are near neutral; excess acid lowers pH", () => {
  const neutral = mixAcidBase(0.1, 0.025, 0.1, 0.025);
  const acidic = mixAcidBase(0.2, 0.025, 0.1, 0.025);
  const basic = mixAcidBase(0.1, 0.025, 0.2, 0.025);
  near(neutral.pH, 7, 1e-6);
  assert.equal(neutral.status, "neutral");
  assert.ok(acidic.pH < 2);
  assert.equal(acidic.status, "acidic");
  assert.ok(basic.pH > 12);
  assert.equal(basic.status, "basic");
  near(acidic.hPlus, 0.05);
});

test("indicator hue moves from red-ish acid toward blue-ish base", () => {
  assert.ok(indicatorHue(2) < indicatorHue(7));
  assert.ok(indicatorHue(7) < indicatorHue(12));
});
