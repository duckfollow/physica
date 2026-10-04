import test from "node:test";
import assert from "node:assert/strict";
import {
  electronShells,
  getElement,
  elementsInPeriod,
  neighborAverage,
  allElements,
} from "../src/simulations/elements.ts";

test("electron shells fill 2 then 8 for light atoms", () => {
  assert.deepEqual(electronShells(1), [1]);
  assert.deepEqual(electronShells(2), [2]);
  assert.deepEqual(electronShells(11), [2, 8, 1]);
  assert.deepEqual(electronShells(18), [2, 8, 8]);
  assert.deepEqual(electronShells(20), [2, 8, 8, 2]);
});

test("periodic placement and trends in period 3", () => {
  const na = getElement(11);
  const cl = getElement(17);
  assert.equal(na.period, 3);
  assert.equal(na.group, 1);
  assert.equal(cl.group, 17);
  assert.ok(na.radiusPm > cl.radiusPm);
  assert.ok(cl.ionizationKJ > na.ionizationKJ);
  assert.equal(elementsInPeriod(3).length, 8);
  assert.equal(allElements().length, 20);
});

test("neighbor average approximates middle-period radius", () => {
  const mid = neighborAverage(14, "radiusPm");
  assert.ok(mid);
  assert.equal(mid!.left.symbol, "Al");
  assert.equal(mid!.right.symbol, "P");
  assert.ok(mid!.errorPct < 15);
  assert.equal(neighborAverage(1, "radiusPm"), null);
});
