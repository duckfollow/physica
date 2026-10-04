import test from "node:test";
import assert from "node:assert/strict";
import {
  dopplerHeard, coulombForce, heatConduction, dnaComplementStrand, dnaMatchCount,
  sineWave, foucaultRate, brownianPath, oerstedField,
} from "../src/simulations/more.ts";

const near = (a: number, b: number, t = 1e-6) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("doppler rises when source approaches", () => {
  const still = dopplerHeard(440, 340, 0, 0);
  const approach = dopplerHeard(440, 340, 0, 30);
  assert.ok(approach.frequency > still.frequency);
});

test("coulomb force is repulsive for like charges and falls with r^2", () => {
  const nearF = coulombForce(2, 2, 0.1);
  const far = coulombForce(2, 2, 0.2);
  assert.equal(nearF.repulsive, true);
  near(far.magnitude * 4, nearF.magnitude, 1e-6);
  assert.equal(coulombForce(2, -2, 0.1).repulsive, false);
});

test("conduction dna sine foucault brownian oersted helpers", () => {
  const h = heatConduction(200, 0.001, 80, 0.4);
  near(h.rate, 40);
  assert.equal(dnaComplementStrand("ATGC"), "TACG");
  assert.equal(dnaMatchCount("AAGG").gc, 2);
  near(sineWave(2, 4, 0, 1), 2 * Math.sin(Math.PI / 2));
  const pole = foucaultRate(90);
  const eq = foucaultRate(0);
  assert.ok(Math.abs(pole.degPerHour) > 10);
  near(eq.omega, 0, 1e-12);
  const walk = brownianPath(50, 1, 7);
  assert.equal(walk.points.length, 51);
  assert.ok(oerstedField(5, 0.05).B > oerstedField(1, 0.05).B);
});
