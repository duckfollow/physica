import { test } from "node:test";
import assert from "node:assert/strict";
import {
  linearValue, linearRoot, quadraticRoots, quadraticVertex, rightTriangle,
  coinProbability, dieProbability, areaUnderQuadratic,
} from "../src/simulations/math.ts";

const near = (a: number, b: number, t = 1e-8) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("linear graph and root behave as expected", () => {
  near(linearValue(2, -4, 3), 2);
  near(linearRoot(2, -4)!, 2);
  assert.equal(linearRoot(0, 1), null);
});

test("quadratic vertex and roots match algebra", () => {
  const v = quadraticVertex(1, -2, 0);
  near(v.x, 1);
  near(v.y, -1);
  const roots = quadraticRoots(1, -3, 2);
  near(roots[0], 1);
  near(roots[1], 2);
  assert.equal(quadraticRoots(1, 0, 1).length, 0);
});

test("trigonometry and probability helpers", () => {
  const t = rightTriangle(30, 2);
  near(t.opposite, 1);
  near(t.adjacent, Math.sqrt(3));
  near(t.sin, 0.5);
  near(coinProbability(2, 2).p, 0.25);
  near(dieProbability(6, 3).p, 1 / 6);
  assert.equal(dieProbability(6, 8).p, 0);
});

test("area under quadratic matches antiderivative closely", () => {
  const a = areaUnderQuadratic(0, 0, 2, 0, 3);
  near(a.exact, 6);
  near(a.approx, 6, 1e-6);
  const b = areaUnderQuadratic(1, 0, 0, 0, 2);
  near(b.exact, 8 / 3);
  near(b.approx, b.exact, 0.05);
});
