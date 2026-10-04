import test from "node:test";
import assert from "node:assert/strict";
import { magnetPoles, lorentzForce, faradayLoop } from "../src/simulations/magnetism.ts";

const near = (a: number, b: number, t = 1e-6) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("like magnet poles repel and opposite attract", () => {
  assert.equal(magnetPoles(1, 1, 10).repulsive, true);
  assert.equal(magnetPoles(1, -1, 10).repulsive, false);
  const nearF = magnetPoles(1, -1, 5).magnitude;
  const far = magnetPoles(1, -1, 10).magnitude;
  assert.ok(nearF > far * 3);
});

test("lorentz radius shrinks with stronger B and vanishes at parallel velocity", () => {
  const a = lorentzForce(1, 1, 2, 20, 90);
  const b = lorentzForce(1, 1, 2, 40, 90);
  assert.ok(Number.isFinite(a.radius));
  near(a.radius, 2 * b.radius, a.radius * 1e-6);
  assert.equal(lorentzForce(1, 1, 2, 40, 0).magnitude, 0);
  assert.equal(lorentzForce(1, 1, 2, 40, 0).radius, Infinity);
});

test("faraday peak emf grows with rpm and is zero when stopped", () => {
  const slow = faradayLoop(50, 40, 100, 60, 0.1);
  const fast = faradayLoop(50, 40, 100, 120, 0.1);
  near(fast.peakEmf, 2 * slow.peakEmf, 1e-12);
  near(faradayLoop(50, 40, 100, 0, 1).emf, 0);
  near(faradayLoop(50, 40, 100, 60, 0).emf, 0);
});
