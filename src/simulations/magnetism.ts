/** Educational bar-magnet interaction: same poles repel, opposite attract. Strength in arbitrary units. */
export function magnetPoles(facingA: 1 | -1, facingB: 1 | -1, distanceCm: number, strength = 1) {
  const r = Math.max(2, distanceCm) / 100;
  const product = facingA * facingB;
  const magnitude = (strength * strength) / (r * r);
  return {
    magnitude,
    repulsive: product > 0,
    force: product * magnitude, // + = repulsive along the line joining them
  };
}

/** Field-line density cue near a bar magnet (closer = denser). */
export function magnetFieldHint(distanceCm: number) {
  const r = Math.max(1, distanceCm);
  return { density: 1 / r, falloff: 1 / (r * r) };
}

/**
 * Lorentz force on a charge in uniform B.
 * q in multiples of e (1.6e-19 C), mass in proton masses, v in 1e6 m/s, B in mT.
 */
const E = 1.602176634e-19;
const MP = 1.67262192369e-27;

export function lorentzForce(
  chargeE: number,
  massProton: number,
  speed1e6: number,
  B_mT: number,
  angleDeg: number,
) {
  const q = chargeE * E;
  const m = Math.max(1e-3, massProton) * MP;
  const v = Math.max(0, speed1e6) * 1e6;
  const B = Math.max(0, B_mT) * 1e-3;
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const vPerp = v * sin;
  const magnitude = Math.abs(q) * v * B * Math.abs(sin);
  const radius =
    Math.abs(q) * B < 1e-30 || vPerp < 1e-12
      ? Infinity
      : (m * vPerp) / (Math.abs(q) * B);
  const period =
    Math.abs(q) * B < 1e-30 ? Infinity : (2 * Math.PI * m) / (Math.abs(q) * B);
  return {
    magnitude,
    radius,
    period,
    vPerp,
    sense: chargeE >= 0 ? ("ccw" as const) : ("cw" as const),
  };
}

/** Faraday rotating-loop model: Φ = N B A cos(ωt), ε = N B A ω sin(ωt). */
export function faradayLoop(
  turns: number,
  B_mT: number,
  areaCm2: number,
  rpm: number,
  timeS: number,
) {
  const N = Math.max(1, turns);
  const B = Math.max(0, B_mT) * 1e-3;
  const A = Math.max(1e-6, areaCm2) * 1e-4;
  const omega = (Math.max(0, rpm) * 2 * Math.PI) / 60;
  const theta = omega * timeS;
  const flux = N * B * A * Math.cos(theta);
  const emf = N * B * A * omega * Math.sin(theta);
  return {
    flux,
    emf,
    omega,
    theta,
    peakEmf: N * B * A * omega,
    peakFlux: N * B * A,
  };
}
