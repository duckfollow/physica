import { test } from "node:test";
import assert from "node:assert/strict";
import {
  inclineMotion, collide, thinLens, decayRemaining, enzymeRate, mendelCross,
  equilibriumAB, idealGas, titrationPH, brakingDistance, wingLift, torque, reactionRate,
  hydrostaticPressure,
} from "../src/simulations/extras.ts";

const near = (a: number, b: number, t = 1e-6) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("incline holds when friction is enough and slides when not", () => {
  assert.equal(inclineMotion(30, 0.8, 1).hold, true);
  assert.equal(inclineMotion(30, 0.1, 1).slides, true);
  near(inclineMotion(0, 0, 2).distance, 0);
});

test("equal-mass elastic collision exchanges velocities", () => {
  const c = collide(2, 4, 2, 0, 1);
  near(c.v1f, 0);
  near(c.v2f, 4);
  near(c.lost, 0, 1e-8);
  assert.ok(collide(2, 4, 2, 0, 0).lost > 0);
});

test("thin lens and decay follow classic relations", () => {
  const L = thinLens(30, 10);
  near(L.imageDistance, 15);
  near(L.magnification, -0.5);
  const d = decayRemaining(800, 2, 6);
  near(d.remaining, 100, 1e-6);
});

test("biology and chemistry helpers respond in expected directions", () => {
  assert.ok(enzymeRate(5, 2, 37, 7).rate > enzymeRate(5, 2, 65, 7).rate);
  const m = mendelCross("Aa", "Aa");
  near(m.phenotypeDominant, 0.75);
  near(m.aa, 0.25);
  near(equilibriumAB(2, 1).A, 1);
  near(idealGas(1, 273.15, 22.414).pressure, 1, 0.02);
  near(titrationPH(0.1, 0.025, 0.1, 0.025).pH, 7, 1e-6);
  assert.ok(reactionRate(2, 350, 1).rate > reactionRate(1, 350, 1).rate);
});

test("everyday mechanics scale as expected", () => {
  const slow = brakingDistance(10, 0.7, 1);
  const fast = brakingDistance(20, 0.7, 1);
  assert.ok(fast.braking > 3.9 * slow.braking);
  assert.equal(wingLift(40, 20, 0.5, 2000).flies, false);
  assert.equal(wingLift(100, 20, 1.2, 800).flies, true);
  near(torque(10, 2, 90).tau, 20);
  near(torque(10, 2, 0).tau, 0, 1e-9);
});

test("hydrostatic pressure grows with depth and density; force with area", () => {
  const shallow = hydrostaticPressure(5, 1000, 0.01);
  const deep = hydrostaticPressure(10, 1000, 0.01);
  const oil = hydrostaticPressure(10, 800, 0.01);
  const wide = hydrostaticPressure(10, 1000, 0.02);
  near(shallow.gauge, 1000 * 9.81 * 5, 1e-6);
  near(deep.gauge, 2 * shallow.gauge, 1e-6);
  assert.ok(oil.gauge < deep.gauge);
  near(wide.force, 2 * deep.force, 1e-6);
  near(shallow.absolute - shallow.gauge, 101325, 1e-6);
  near(hydrostaticPressure(0, 1000).gauge, 0, 1e-9);
});
