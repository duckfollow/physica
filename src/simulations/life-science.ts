export type OsmosisOutcome = "turgid" | "flaccid" | "plasmolyzed";
export type Tonicity = "hypotonic" | "hypertonic" | "isotonic";
export type SolutionStatus = "acidic" | "basic" | "neutral";

/** Plant-cell osmosis: concentrations in mol/L (relative educational scale). */
export function osmosisCell(internal: number, external: number, time: number) {
  const delta = internal - external;
  const equilibrium = Math.min(1.7, Math.max(0.4, 1 + 0.55 * Math.tanh(2.5 * delta)));
  const volume = 1 + (equilibrium - 1) * (1 - Math.exp(-0.75 * time));
  const outcome: OsmosisOutcome = volume >= 1.28 ? "turgid" : volume <= 0.72 ? "plasmolyzed" : "flaccid";
  const tonicity: Tonicity = Math.abs(delta) < 0.05 ? "isotonic" : delta > 0 ? "hypotonic" : "hypertonic";
  return { delta, volume, equilibrium, outcome, tonicity, waterIn: delta > 0 };
}

const KW = 1e-14;
/** Strong acid + strong base mixing. Volumes in litres, concentrations in mol/L. */
export function mixAcidBase(acidM: number, acidL: number, baseM: number, baseL: number) {
  const molesH = Math.max(0, acidM) * Math.max(0, acidL);
  const molesOH = Math.max(0, baseM) * Math.max(0, baseL);
  const volume = Math.max(1e-9, acidL + baseL);
  const excess = molesH - molesOH;
  let hPlus: number;
  if (Math.abs(excess) < 1e-12) hPlus = Math.sqrt(KW);
  else if (excess > 0) hPlus = excess / volume;
  else hPlus = KW / (-excess / volume);
  hPlus = Math.min(1, Math.max(KW, hPlus));
  const pH = -Math.log10(hPlus);
  const status: SolutionStatus = pH < 6.5 ? "acidic" : pH > 7.5 ? "basic" : "neutral";
  return { pH, hPlus, excess, volume, status, molesH, molesOH };
}

/** Simple indicator colour hue from pH (educational, not a real dye spectrum). */
export function indicatorHue(pH: number) {
  return Math.max(0, Math.min(280, pH * 18));
}
