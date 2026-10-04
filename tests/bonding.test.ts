import test from "node:test";
import assert from "node:assert/strict";
import { bondFromSymbols, ionicFormula, lewisPreset } from "../src/simulations/bonding.ts";

const near = (a: number, b: number, t = 1e-9) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("electronegativity difference classifies H2 HCl and NaCl", () => {
  assert.equal(bondFromSymbols("H", "H").kind, "nonpolar");
  assert.equal(bondFromSymbols("H", "Cl").kind, "polar");
  assert.equal(bondFromSymbols("Na", "Cl").kind, "ionic");
  near(bondFromSymbols("H", "Cl").delta, Math.abs(2.2 - 3.16));
});

test("ionic formulas balance charges", () => {
  assert.deepEqual(ionicFormula(1, 1), { nCat: 1, nAn: 1, ratio: "1:1", transferred: 1, neutral: true });
  assert.deepEqual(ionicFormula(2, 1), { nCat: 1, nAn: 2, ratio: "1:2", transferred: 2, neutral: true });
  assert.deepEqual(ionicFormula(3, 2), { nCat: 2, nAn: 3, ratio: "2:3", transferred: 6, neutral: true });
});

test("lewis presets satisfy teaching octets or duets", () => {
  for (const id of ["H2", "Cl2", "O2", "N2", "H2O", "CO2", "NH3", "CH4"] as const) {
    const m = lewisPreset(id);
    assert.equal(m.octetsOk, true, id);
    assert.ok(m.totalValence >= 2);
  }
  assert.equal(lewisPreset("O2").bondOrder, 2);
  assert.equal(lewisPreset("N2").bondOrder, 3);
  assert.equal(lewisPreset("CH4").centralAround, 8);
  assert.equal(lewisPreset("H2").centralAround, 2);
});
