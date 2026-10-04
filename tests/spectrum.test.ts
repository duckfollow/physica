import test from "node:test";
import assert from "node:assert/strict";
import {
  HYDROGEN_LINES,
  prismDeviationDeg,
  spectrumKind,
  spectrumLines,
  spectrumPosition,
  wavelengthToHue,
} from "../src/simulations/spectrum.ts";

const near = (a: number, b: number, t = 1e-6) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test("visible spectrum maps wavelength to position and hue order", () => {
  near(spectrumPosition(380), 0);
  near(spectrumPosition(750), 1);
  assert.ok(wavelengthToHue(400) > wavelengthToHue(700));
});

test("shorter wavelengths deviate more in the prism model", () => {
  assert.ok(prismDeviationDeg(420) > prismDeviationDeg(680));
});

test("line and absorption modes expose hydrogen or sodium lines", () => {
  assert.equal(spectrumKind("continuous"), "ต่อเนื่อง");
  assert.equal(spectrumLines("continuous").length, 0);
  assert.equal(spectrumLines("hydrogen").length, HYDROGEN_LINES.length);
  assert.ok(spectrumLines("sodium").every((l) => l.wavelength > 580 && l.wavelength < 600));
  assert.equal(spectrumLines("absorption").length, HYDROGEN_LINES.length);
});
