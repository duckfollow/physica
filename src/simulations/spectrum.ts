export type SpectrumMode = "continuous" | "hydrogen" | "sodium" | "absorption";

/** Visible window used in the lab (nm). */
export const VISIBLE = { min: 380, max: 750 } as const;

/** Approximate Balmer emission lines of hydrogen (nm). */
export const HYDROGEN_LINES = [
  { label: "Hα", wavelength: 656.3 },
  { label: "Hβ", wavelength: 486.1 },
  { label: "Hγ", wavelength: 434.0 },
  { label: "Hδ", wavelength: 410.2 },
] as const;

/** Sodium D-lines approximated as a bright yellow doublet near 589 nm. */
export const SODIUM_LINES = [
  { label: "D1", wavelength: 589.6 },
  { label: "D2", wavelength: 589.0 },
] as const;

/** Map wavelength (nm) to a CSS HSL hue for educational display. */
export function wavelengthToHue(nm: number) {
  const clamped = Math.min(VISIBLE.max, Math.max(VISIBLE.min, nm));
  // violet ~270 → red ~0 across the visible band
  return ((VISIBLE.max - clamped) / (VISIBLE.max - VISIBLE.min)) * 270;
}

export function wavelengthToColor(nm: number, lightness = 55) {
  return `hsl(${wavelengthToHue(nm)} 85% ${lightness}%)`;
}

/** Fractional position 0…1 across a spectrum strip for a wavelength. */
export function spectrumPosition(nm: number) {
  return (Math.min(VISIBLE.max, Math.max(VISIBLE.min, nm)) - VISIBLE.min) / (VISIBLE.max - VISIBLE.min);
}

/** Educational prism deviation: shorter λ bends more (larger angle). */
export function prismDeviationDeg(nm: number, apexDeg = 60, baseIndex = 1.5) {
  const λ = Math.min(VISIBLE.max, Math.max(VISIBLE.min, nm));
  // Cauchy-like: n decreases with wavelength
  const n = baseIndex + 0.02 * ((500 / λ) ** 2);
  const A = (apexDeg * Math.PI) / 180;
  const sinHalf = Math.min(0.999, (n * Math.sin(A / 2)));
  const deviation = 2 * Math.asin(sinHalf) - A;
  return (deviation * 180) / Math.PI;
}

export function spectrumLines(mode: SpectrumMode) {
  if (mode === "hydrogen") return HYDROGEN_LINES.map((l) => ({ ...l }));
  if (mode === "sodium") return SODIUM_LINES.map((l) => ({ ...l }));
  if (mode === "absorption") {
    // dark lines carved from continuous: use hydrogen positions as Fraunhofer-like demo
    return HYDROGEN_LINES.map((l) => ({ ...l }));
  }
  return [] as { label: string; wavelength: number }[];
}

export function spectrumKind(mode: SpectrumMode) {
  if (mode === "continuous") return "ต่อเนื่อง";
  if (mode === "absorption") return "ดูดกลืน (มืดบนพื้นสว่าง)";
  return "เปล่งแสง (สว่างบนพื้นมืด)";
}
