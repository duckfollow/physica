const G = 9.81;

/** Torricelli barometer: atmospheric pressure supports a liquid column P = ρ g h. */
export function torricelliColumn(pressurePa: number, density: number, g = G) {
  const p = Math.max(1, pressurePa);
  const rho = Math.max(1, density);
  const height = p / (rho * g);
  return {
    height,
    heightMm: height * 1000,
    heightCm: height * 100,
    pressurePa: p,
    pressureAtm: p / 101_325,
    density: rho,
  };
}

/** Young double-slit fringe spacing Δy = λ L / d (small-angle). */
export function youngFringes(wavelengthNm: number, slitSepMm: number, screenDistM: number) {
  const lambda = Math.max(1, wavelengthNm) * 1e-9;
  const d = Math.max(1e-6, slitSepMm * 1e-3);
  const L = Math.max(0.1, screenDistM);
  const spacing = (lambda * L) / d;
  return { lambda, d, L, spacing, spacingMm: spacing * 1000 };
}

/** Normalized intensity on screen at offset x (meters) from center: cos²(π d x /(λ L)). */
export function youngIntensity(x: number, wavelengthNm: number, slitSepMm: number, screenDistM: number) {
  const { lambda, d, L } = youngFringes(wavelengthNm, slitSepMm, screenDistM);
  const arg = (Math.PI * d * x) / (lambda * L);
  return Math.cos(arg) ** 2;
}

/**
 * Rutherford scattering angle for impact parameter b.
 * Uses D = (Z₁ Z₂ e²)/(4πϵ₀ K) ≈ 1.44 Z₁ Z₂ / K_MeV in fm.
 */
export function rutherfordScatter(impactParamFm: number, kineticMeV: number, targetZ = 79, projectileZ = 2) {
  const K = Math.max(0.05, kineticMeV);
  const b = Math.max(0.01, impactParamFm);
  const D = (1.43996 * projectileZ * targetZ) / K;
  const theta = 2 * Math.atan(D / (2 * b));
  return {
    theta,
    thetaDeg: (theta * 180) / Math.PI,
    closestApproach: D,
    impactParam: b,
    kineticMeV: K,
  };
}

/** Sample many impact parameters for a scattering histogram (educational). */
export function rutherfordHistogram(kineticMeV: number, samples = 400, maxB = 400, bins = 18) {
  const counts = Array.from({ length: bins }, () => 0);
  const edges = Array.from({ length: bins + 1 }, (_, i) => (i * 180) / bins);
  for (let i = 0; i < samples; i++) {
    // more particles at large b (annular area ∝ b db) — sample b ∝ sqrt(u)
    const b = maxB * Math.sqrt((i + 0.5) / samples);
    const { thetaDeg } = rutherfordScatter(b, kineticMeV);
    const idx = Math.min(bins - 1, Math.floor((thetaDeg / 180) * bins));
    counts[idx] += 1;
  }
  return { counts, edges, samples };
}
