const K_E = 8.9875517923e9;
const MU0 = 4e-7 * Math.PI;
const OMEGA_EARTH = 7.292115e-5; // rad/s

/** Doppler for sound: observer/source speeds along line of sight. Positive = toward the other. */
export function dopplerHeard(
  sourceHz: number,
  vSound = 340,
  vObserver = 0,
  vSource = 0,
) {
  const vs = Math.max(1, vSound);
  const denom = Math.max(1e-6, vs - vSource);
  const f = sourceHz * ((vs + vObserver) / denom);
  return {
    frequency: f,
    wavelength: vs / Math.max(1e-9, sourceHz),
    heardWavelength: vs / Math.max(1e-9, f),
    shift: f - sourceHz,
  };
}

/** Coulomb force magnitude and sign convention: positive = repulsive. */
export function coulombForce(q1uC: number, q2uC: number, distanceM: number) {
  const r = Math.max(1e-6, distanceM);
  const q1 = q1uC * 1e-6;
  const q2 = q2uC * 1e-6;
  const force = (K_E * q1 * q2) / (r * r);
  return {
    force,
    magnitude: Math.abs(force),
    repulsive: q1 * q2 > 0,
    fieldFromQ1: (K_E * q1) / (r * r),
  };
}

/** Steady conduction rate Q/t = k A ΔT / L and simple linear temperature profile. */
export function heatConduction(k: number, area: number, dT: number, length: number) {
  const L = Math.max(1e-6, length);
  const rate = (k * area * dT) / L;
  return {
    rate,
    gradient: dT / L,
    tempAt: (x: number, tHot: number) => tHot - (dT * Math.min(1, Math.max(0, x / L))),
  };
}

const PAIR: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };

export function dnaComplement(base: string) {
  return PAIR[base.toUpperCase()] ?? null;
}

export function dnaComplementStrand(seq: string) {
  return [...seq.toUpperCase()].map((b) => PAIR[b] ?? "·").join("");
}

export function dnaMatchCount(seq: string) {
  const s = seq.toUpperCase().replace(/[^ATCG]/g, "");
  let pairs = 0;
  for (const b of s) if (PAIR[b]) pairs++;
  return { length: s.length, paired: pairs, gc: [...s].filter((b) => b === "G" || b === "C").length };
}

/** y = A sin(ωx + φ) with ω = 2π/period. */
export function sineWave(amplitude: number, period: number, phaseDeg: number, x: number) {
  const T = Math.max(0.2, period);
  const omega = (2 * Math.PI) / T;
  const phi = (phaseDeg * Math.PI) / 180;
  return amplitude * Math.sin(omega * x + phi);
}

/** Foucault precession rate Ω sinφ (rad/s) and degrees per hour. */
export function foucaultRate(latitudeDeg: number) {
  const lat = Math.max(-90, Math.min(90, latitudeDeg));
  const rad = (lat * Math.PI) / 180;
  const omega = OMEGA_EARTH * Math.sin(rad);
  return {
    omega,
    degPerHour: (omega * 180) / Math.PI * 3600,
    periodHours: Math.abs(omega) < 1e-12 ? Infinity : (2 * Math.PI) / Math.abs(omega) / 3600,
  };
}

/** Deterministic Brownian-like 2D walk for reproducible paths. */
export function brownianPath(steps = 200, stepSize = 1, seed = 1) {
  let s = seed >>> 0 || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const points = [{ x: 0, y: 0 }];
  let x = 0, y = 0;
  for (let i = 0; i < steps; i++) {
    const a = rand() * 2 * Math.PI;
    x += stepSize * Math.cos(a);
    y += stepSize * Math.sin(a);
    points.push({ x, y });
  }
  const end = points.at(-1)!;
  return { points, end, distance: Math.hypot(end.x, end.y) };
}

/** Magnetic field around long straight wire; educational compass tip angle ∝ B. */
export function oerstedField(currentA: number, radiusM: number) {
  const r = Math.max(1e-4, radiusM);
  const B = (MU0 * Math.abs(currentA)) / (2 * Math.PI * r);
  // map B into a visible deflection up to ~80°
  const tipDeg = Math.sign(currentA || 1) * Math.min(80, B * 8e5);
  return { B, tipDeg, direction: currentA >= 0 ? "ccw" as const : "cw" as const };
}
