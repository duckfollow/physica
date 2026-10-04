/** Pauling electronegativity for a small teaching set. */
export const EN: Record<string, number> = {
  H: 2.20, C: 2.55, N: 3.04, O: 3.44, F: 3.98,
  Na: 0.93, Mg: 1.31, Cl: 3.16, K: 0.82, Ca: 1.00,
  S: 2.58, P: 2.19, Br: 2.96, I: 2.66, Li: 0.98,
};

export const BOND_PAIR_SYMBOLS = [
  "H", "C", "N", "O", "F", "Na", "Mg", "Cl", "K", "Ca", "S", "P", "Br", "I", "Li",
] as const;

export type BondKind = "nonpolar" | "polar" | "ionic";

/** Classify bond from |ΔEN|; educational cutoffs ~0.4 and ~1.7. */
export function bondFromEN(enA: number, enB: number) {
  const delta = Math.abs(enA - enB);
  let kind: BondKind = "nonpolar";
  if (delta >= 1.7) kind = "ionic";
  else if (delta >= 0.4) kind = "polar";
  return {
    delta,
    kind,
    polarity: Math.min(1, delta / 3.2),
    label: kind === "ionic" ? "ไอออนิก" : kind === "polar" ? "โคเวเลนต์มีขั้ว" : "โคเวเลนต์ไม่มีขั้ว",
    richer: enA === enB ? null : enA > enB ? ("A" as const) : ("B" as const),
  };
}

export function bondFromSymbols(a: string, b: string) {
  const enA = EN[a], enB = EN[b];
  if (enA === undefined || enB === undefined) throw new RangeError("unknown element");
  return { ...bondFromEN(enA, enB), enA, enB, a, b };
}

function gcd(x: number, y: number): number {
  return y === 0 ? x : gcd(y, x % y);
}

/** Ionic formula unit: balance charges to a neutral ratio. */
export function ionicFormula(cationCharge: number, anionCharge: number) {
  const c = Math.abs(Math.round(cationCharge));
  const a = Math.abs(Math.round(anionCharge));
  if (c < 1 || a < 1 || c > 4 || a > 4) throw new RangeError("charge out of range");
  const g = gcd(c, a);
  const nCat = a / g;
  const nAn = c / g;
  return {
    nCat,
    nAn,
    ratio: `${nCat}:${nAn}`,
    transferred: nCat * c,
    neutral: nCat * c === nAn * a,
  };
}

/** Electron-count summary for a simple AXₙ Lewis picture. */
export function lewisCount(
  valenceCentral: number,
  valenceTerminal: number,
  terminals: number,
  bondOrder: number,
) {
  const n = Math.max(1, Math.min(6, Math.round(terminals)));
  const order = Math.max(1, Math.min(3, Math.round(bondOrder)));
  const totalValence = valenceCentral + n * valenceTerminal;
  const bondingElectrons = 2 * n * order;
  const leftover = totalValence - bondingElectrons;
  const terminalLoneEach = Math.max(0, valenceTerminal - order);
  const terminalLoneTotal = n * terminalLoneEach;
  const centralLone = Math.max(0, leftover - terminalLoneTotal);
  // Octet/duet counting: each atom counts both electrons in every bond to it.
  const centralAround = centralLone + 2 * n * order;
  const terminalAround = terminalLoneEach + 2 * order;
  const terminalOk = valenceTerminal === 1 ? terminalAround === 2 : terminalAround === 8;
  const centralOk = valenceCentral === 1 ? centralAround === 2 : centralAround === 8;
  return {
    totalValence,
    bondingElectrons,
    sharedPairs: n * order,
    centralAround,
    terminalAround,
    centralLone,
    octetsOk: centralOk && terminalOk,
  };
}

export type LewisPreset = "H2" | "Cl2" | "O2" | "N2" | "H2O" | "CO2" | "NH3" | "CH4";

export function lewisPreset(id: LewisPreset) {
  const table: Record<LewisPreset, {
    formula: string; central: string; terminals: string[]; bondOrder: number;
    valenceCentral: number; valenceTerminal: number; shape: string;
  }> = {
    H2: { formula: "H₂", central: "H", terminals: ["H"], bondOrder: 1, valenceCentral: 1, valenceTerminal: 1, shape: "ไดอะตอมิก" },
    Cl2: { formula: "Cl₂", central: "Cl", terminals: ["Cl"], bondOrder: 1, valenceCentral: 7, valenceTerminal: 7, shape: "ไดอะตอมิก" },
    O2: { formula: "O₂", central: "O", terminals: ["O"], bondOrder: 2, valenceCentral: 6, valenceTerminal: 6, shape: "ไดอะตอมิก" },
    N2: { formula: "N₂", central: "N", terminals: ["N"], bondOrder: 3, valenceCentral: 5, valenceTerminal: 5, shape: "ไดอะตอมิก" },
    H2O: { formula: "H₂O", central: "O", terminals: ["H", "H"], bondOrder: 1, valenceCentral: 6, valenceTerminal: 1, shape: "งอ (~104.5°)" },
    CO2: { formula: "CO₂", central: "C", terminals: ["O", "O"], bondOrder: 2, valenceCentral: 4, valenceTerminal: 6, shape: "เส้นตรง" },
    NH3: { formula: "NH₃", central: "N", terminals: ["H", "H", "H"], bondOrder: 1, valenceCentral: 5, valenceTerminal: 1, shape: "พีระมิดสามเหลี่ยม" },
    CH4: { formula: "CH₄", central: "C", terminals: ["H", "H", "H", "H"], bondOrder: 1, valenceCentral: 4, valenceTerminal: 1, shape: "ทรงสี่หน้า" },
  };
  const p = table[id];
  const n = p.terminals.length;
  return { ...p, n, ...lewisCount(p.valenceCentral, p.valenceTerminal, n, p.bondOrder) };
}
