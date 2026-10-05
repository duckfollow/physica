import test from "node:test";
import assert from "node:assert/strict";
import { wireResistance, wireCircuit, WIRE_MATERIALS } from "../src/simulations/wire.ts";

const near = (a: number, b: number, t = 1e-9) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("thicker wire has lower resistance; longer wire has higher", () => {
  const thin = wireResistance(WIRE_MATERIALS.copper.rho, 50, 1);
  const thick = wireResistance(WIRE_MATERIALS.copper.rho, 50, 2);
  near(thick.resistance * 4, thin.resistance, thin.resistance * 1e-9);
  const short = wireResistance(WIRE_MATERIALS.copper.rho, 25, 1);
  near(thin.resistance, 2 * short.resistance, thin.resistance * 1e-9);
});

test("nichrome has more drop and heat than copper for same geometry", () => {
  const cu = wireCircuit(12, 10, WIRE_MATERIALS.copper.rho, 40, 1);
  const ni = wireCircuit(12, 10, WIRE_MATERIALS.nichrome.rho, 40, 1);
  assert.ok(ni.resistance > cu.resistance);
  assert.ok(ni.current < cu.current);
  assert.ok(ni.dropWire > cu.dropWire);
  assert.ok(ni.heatWire > cu.heatWire);
  near(cu.dropWire + cu.dropLoad, 12, 1e-9);
});
