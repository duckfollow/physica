export type ElementCategory =
  | "alkali"
  | "alkaline-earth"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "other-metal";

export type ElementInfo = {
  Z: number;
  symbol: string;
  nameTh: string;
  period: number;
  /** IUPAC group 1–18 for main-group teaching set. */
  group: number;
  category: ElementCategory;
  /** Approximate covalent/atomic radius in pm (educational). */
  radiusPm: number;
  /** Approximate first ionization energy in kJ/mol (educational). */
  ionizationKJ: number;
};

/** Main-group teaching set H–Ca (Z = 1…20). */
const ELEMENTS: ElementInfo[] = [
  { Z: 1, symbol: "H", nameTh: "ไฮโดรเจน", period: 1, group: 1, category: "nonmetal", radiusPm: 31, ionizationKJ: 1312 },
  { Z: 2, symbol: "He", nameTh: "ฮีเลียม", period: 1, group: 18, category: "noble", radiusPm: 28, ionizationKJ: 2372 },
  { Z: 3, symbol: "Li", nameTh: "ลิเทียม", period: 2, group: 1, category: "alkali", radiusPm: 128, ionizationKJ: 520 },
  { Z: 4, symbol: "Be", nameTh: "เบริลเลียม", period: 2, group: 2, category: "alkaline-earth", radiusPm: 96, ionizationKJ: 899 },
  { Z: 5, symbol: "B", nameTh: "โบรอน", period: 2, group: 13, category: "metalloid", radiusPm: 84, ionizationKJ: 801 },
  { Z: 6, symbol: "C", nameTh: "คาร์บอน", period: 2, group: 14, category: "nonmetal", radiusPm: 76, ionizationKJ: 1086 },
  { Z: 7, symbol: "N", nameTh: "ไนโตรเจน", period: 2, group: 15, category: "nonmetal", radiusPm: 71, ionizationKJ: 1402 },
  { Z: 8, symbol: "O", nameTh: "ออกซิเจน", period: 2, group: 16, category: "nonmetal", radiusPm: 66, ionizationKJ: 1314 },
  { Z: 9, symbol: "F", nameTh: "ฟลูออรีน", period: 2, group: 17, category: "halogen", radiusPm: 57, ionizationKJ: 1681 },
  { Z: 10, symbol: "Ne", nameTh: "นีออน", period: 2, group: 18, category: "noble", radiusPm: 58, ionizationKJ: 2081 },
  { Z: 11, symbol: "Na", nameTh: "โซเดียม", period: 3, group: 1, category: "alkali", radiusPm: 166, ionizationKJ: 496 },
  { Z: 12, symbol: "Mg", nameTh: "แมกนีเซียม", period: 3, group: 2, category: "alkaline-earth", radiusPm: 141, ionizationKJ: 738 },
  { Z: 13, symbol: "Al", nameTh: "อะลูมิเนียม", period: 3, group: 13, category: "other-metal", radiusPm: 121, ionizationKJ: 577 },
  { Z: 14, symbol: "Si", nameTh: "ซิลิคอน", period: 3, group: 14, category: "metalloid", radiusPm: 111, ionizationKJ: 786 },
  { Z: 15, symbol: "P", nameTh: "ฟอสฟอรัส", period: 3, group: 15, category: "nonmetal", radiusPm: 107, ionizationKJ: 1012 },
  { Z: 16, symbol: "S", nameTh: "กำมะถัน", period: 3, group: 16, category: "nonmetal", radiusPm: 105, ionizationKJ: 1000 },
  { Z: 17, symbol: "Cl", nameTh: "คลอรีน", period: 3, group: 17, category: "halogen", radiusPm: 102, ionizationKJ: 1251 },
  { Z: 18, symbol: "Ar", nameTh: "อาร์กอน", period: 3, group: 18, category: "noble", radiusPm: 106, ionizationKJ: 1520 },
  { Z: 19, symbol: "K", nameTh: "โพแทสเซียม", period: 4, group: 1, category: "alkali", radiusPm: 203, ionizationKJ: 419 },
  { Z: 20, symbol: "Ca", nameTh: "แคลเซียม", period: 4, group: 2, category: "alkaline-earth", radiusPm: 176, ionizationKJ: 590 },
];

const CAPACITY = [2, 8, 8, 18];

/** Fill electron shells left-to-right for Z ≤ 20 (K, L, M, N). */
export function electronShells(Z: number) {
  let left = Math.max(0, Math.min(20, Math.round(Z)));
  const shells: number[] = [];
  for (const cap of CAPACITY) {
    if (left <= 0) break;
    const n = Math.min(cap, left);
    shells.push(n);
    left -= n;
  }
  return shells;
}

export function getElement(Z: number): ElementInfo {
  const z = Math.max(1, Math.min(20, Math.round(Z)));
  return ELEMENTS[z - 1];
}

export function elementsInPeriod(period: number) {
  return ELEMENTS.filter((e) => e.period === period);
}

export function allElements() {
  return ELEMENTS.slice();
}

/** Neighbor average of a numeric property — used to show Mendeleev-style prediction. */
export function neighborAverage(Z: number, key: "radiusPm" | "ionizationKJ") {
  const el = getElement(Z);
  const samePeriod = elementsInPeriod(el.period).filter((e) => e.Z !== el.Z);
  const left = samePeriod.filter((e) => e.Z < el.Z).at(-1);
  const right = samePeriod.filter((e) => e.Z > el.Z).at(0);
  if (!left || !right) return null;
  const predicted = (left[key] + right[key]) / 2;
  const actual = el[key];
  return { left, right, predicted, actual, errorPct: (Math.abs(predicted - actual) / actual) * 100 };
}

export const CATEGORY_LABEL: Record<ElementCategory, string> = {
  alkali: "โลหะแอลคาไล",
  "alkaline-earth": "โลหะแอลคาไลน์เอิร์ธ",
  metalloid: "กึ่งโลหะ",
  nonmetal: "อโลหะ",
  halogen: "แฮโลเจน",
  noble: "แก๊สมีตระกูล",
  "other-metal": "โลหะอื่น",
};
