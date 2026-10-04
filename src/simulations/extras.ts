const G = 9.81;

/** Inclined plane with kinetic friction; distance along plane after time t from rest if it slides. */
export function inclineMotion(angleDeg: number, mu: number, time: number) {
  const theta = (angleDeg * Math.PI) / 180;
  const accel = G * (Math.sin(theta) - mu * Math.cos(theta));
  const slides = accel > 1e-9;
  const a = slides ? accel : 0;
  const distance = 0.5 * a * time * time;
  const speed = a * time;
  const hold = mu >= Math.tan(theta) - 1e-12;
  return { theta, accel: a, distance, speed, slides: slides && !hold, hold };
}

/** 1D collision of two masses; e = coefficient of restitution (0..1). */
export function collide(m1: number, v1: number, m2: number, v2: number, e: number) {
  const u1 = v1, u2 = v2;
  const v1f = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / (m1 + m2);
  const v2f = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / (m1 + m2);
  const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const keAfter = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
  return { v1f, v2f, keBefore, keAfter, lost: keBefore - keAfter };
}

/** Thin lens equation; object distance o > 0, focal f (+ converging). */
export function thinLens(objectDistance: number, focal: number) {
  if (Math.abs(objectDistance - focal) < 1e-9) return { imageDistance: Infinity, magnification: Infinity, real: false, kind: "no-image" as const };
  const imageDistance = 1 / (1 / focal - 1 / objectDistance);
  const magnification = -imageDistance / objectDistance;
  const real = imageDistance > 0;
  const kind = real ? ("real" as const) : ("virtual" as const);
  return { imageDistance, magnification, real, kind };
}

/** Simple DC motor: torque ∝ I, back-emf ∝ ω, steady ω = (V - I R related) educational model. */
export function motorSpeed(voltage: number, load: number, field: number) {
  const resistance = 2;
  const ke = 0.15 * field;
  const kt = 0.15 * field;
  const omega = Math.max(0, (kt * voltage - load * resistance) / (kt * ke + 0.05 * load + 0.02));
  const current = Math.max(0, (voltage - ke * omega) / resistance);
  const torque = kt * current;
  return { omega, current, torque, rpm: (omega * 60) / (2 * Math.PI) };
}

/** Radioactive decay N = N0 e^{-λt}, half-life T½. */
export function decayRemaining(n0: number, halfLife: number, time: number) {
  const lambda = Math.LN2 / Math.max(1e-9, halfLife);
  const remaining = n0 * Math.exp(-lambda * time);
  const elapsedHalves = time / Math.max(1e-9, halfLife);
  return { remaining, lambda, elapsedHalves, fraction: remaining / n0 };
}

/** Enzyme rate: Michaelis–Menten × temperature bell × pH bell. */
export function enzymeRate(substrate: number, km: number, temp: number, pH: number) {
  const vmax = 1;
  const mm = (vmax * substrate) / (km + substrate);
  const tempFactor = Math.exp(-((temp - 37) ** 2) / (2 * 12 ** 2));
  const denature = temp > 50 ? Math.exp(-(temp - 50) / 6) : 1;
  const pHFactor = Math.exp(-((pH - 7) ** 2) / (2 * 1.2 ** 2));
  const rate = mm * tempFactor * denature * pHFactor;
  return { rate, mm, tempFactor: tempFactor * denature, pHFactor };
}

/** Photosynthesis relative rate from light and CO2 (educational saturating curves). */
export function photosynthesisRate(light: number, co2: number, temperature: number) {
  const lightTerm = light / (light + 200);
  const co2Term = co2 / (co2 + 200);
  const tempTerm = Math.exp(-((temperature - 25) ** 2) / (2 * 10 ** 2));
  const rate = 100 * lightTerm * co2Term * tempTerm;
  return { rate, lightTerm, co2Term, tempTerm };
}

/** Mendel monohybrid: AA, Aa, aa parents → offspring genotype probabilities. */
export function mendelCross(parent1: "AA" | "Aa" | "aa", parent2: "AA" | "Aa" | "aa") {
  const alleles = (g: "AA" | "Aa" | "aa") => (g === "AA" ? ["A", "A"] : g === "aa" ? ["a", "a"] : ["A", "a"]);
  const a1 = alleles(parent1), a2 = alleles(parent2);
  const counts = { AA: 0, Aa: 0, aa: 0 };
  for (const x of a1) for (const y of a2) {
    const key = (x === y ? x + y : "Aa") as "AA" | "Aa" | "aa";
    counts[key]++;
  }
  const total = 4;
  const dominant = (counts.AA + counts.Aa) / total;
  const recessive = counts.aa / total;
  return {
    AA: counts.AA / total,
    Aa: counts.Aa / total,
    aa: counts.aa / total,
    phenotypeDominant: dominant,
    phenotypeRecessive: recessive,
  };
}

/** Lotka–Volterra one step / state at time via simple RK for display path. */
export function predatorPreyPath(prey0: number, predator0: number, a = 1.1, b = 0.4, c = 0.4, d = 0.1) {
  const dt = 0.02, points = [] as { t: number; prey: number; predator: number }[];
  let x = prey0, y = predator0;
  for (let i = 0; i <= 800; i++) {
    points.push({ t: i * dt, prey: x, predator: y });
    const dx = a * x - b * x * y;
    const dy = c * x * y - d * y;
    x = Math.max(0.01, x + dx * dt);
    y = Math.max(0.01, y + dy * dt);
  }
  return points;
}

/** Reaction rate k[A]^n style with Arrhenius temperature factor. */
export function reactionRate(concentration: number, temperature: number, order: number, ea = 50) {
  const k0 = 2;
  const k = k0 * Math.exp(-ea / Math.max(1, temperature));
  const rate = k * concentration ** order;
  return { k, rate };
}

/** Simple equilibrium A ⇌ B with K = [B]/[A], total conserved. */
export function equilibriumAB(total: number, K: number) {
  const A = total / (1 + K);
  const B = total - A;
  return { A, B, ratio: B / Math.max(1e-12, A) };
}

/** Ideal gas: PV = nRT, solve for any missing emphasis on P. */
export function idealGas(n: number, temperature: number, volume: number) {
  const R = 0.082057;
  const pressure = (n * R * temperature) / Math.max(1e-9, volume);
  return { pressure, R };
}

/** Strong acid titrated by strong base: pH after adding base volume. */
export function titrationPH(acidM: number, acidL: number, baseM: number, baseAddedL: number) {
  const molesH = acidM * acidL;
  const molesOH = baseM * baseAddedL;
  const volume = Math.max(1e-9, acidL + baseAddedL);
  const excess = molesH - molesOH;
  const KW = 1e-14;
  let hPlus: number;
  if (Math.abs(excess) < 1e-12) hPlus = Math.sqrt(KW);
  else if (excess > 0) hPlus = excess / volume;
  else hPlus = KW / (-excess / volume);
  hPlus = Math.min(1, Math.max(KW, hPlus));
  return { pH: -Math.log10(hPlus), excess, volume, equivalenceL: acidM * acidL / Math.max(1e-9, baseM) };
}

/** Braking distance from v² = u² + 2as with deceleration μ g. */
export function brakingDistance(speed: number, mu: number, reactionTime: number) {
  const decel = mu * G;
  const reaction = speed * reactionTime;
  const braking = speed * speed / Math.max(1e-9, 2 * decel);
  return { reaction, braking, total: reaction + braking, decel };
}

/** Airplane lift L = ½ ρ v² A C_L educational compare to weight. */
export function wingLift(speed: number, area: number, cl: number, mass: number, rho = 1.225) {
  const lift = 0.5 * rho * speed * speed * area * cl;
  const weight = mass * G;
  return { lift, weight, ratio: lift / weight, flies: lift >= weight };
}

/** Torque τ = r F sinθ; compare opening a door. */
export function torque(force: number, radius: number, angleDeg: number) {
  const theta = (angleDeg * Math.PI) / 180;
  const tau = force * radius * Math.sin(theta);
  return { tau, theta, lever: radius * Math.sin(theta) };
}
