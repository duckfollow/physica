/** Resistivity ρ at ~20 °C (Ω·m) for teaching materials. */
export const WIRE_MATERIALS = {
  copper: { label: "ทองแดง", rho: 1.68e-8 },
  aluminum: { label: "อะลูมิเนียม", rho: 2.65e-8 },
  iron: { label: "เหล็ก", rho: 9.71e-8 },
  nichrome: { label: "นิโครม", rho: 1.1e-6 },
} as const;

export type WireMaterialId = keyof typeof WIRE_MATERIALS;

/** R = ρL/A for a round wire; diameterMm in mm, lengthM in m. */
export function wireResistance(rho: number, lengthM: number, diameterMm: number) {
  if (!Number.isFinite(rho) || rho <= 0) throw new RangeError("resistivity must be positive");
  if (!Number.isFinite(lengthM) || lengthM <= 0) throw new RangeError("length must be positive");
  if (!Number.isFinite(diameterMm) || diameterMm <= 0) throw new RangeError("diameter must be positive");
  const radiusM = (diameterMm / 1000) / 2;
  const area = Math.PI * radiusM * radiusM;
  const resistance = (rho * lengthM) / area;
  return { area, resistance, radiusM };
}

/**
 * Battery + series wire + fixed load.
 * Shows how wire geometry/material changes current, drop on the wire, and heat in the wire.
 */
export function wireCircuit(
  voltage: number,
  loadOhm: number,
  rho: number,
  lengthM: number,
  diameterMm: number,
) {
  if (!Number.isFinite(voltage) || voltage < 0) throw new RangeError("voltage must be nonnegative");
  if (!Number.isFinite(loadOhm) || loadOhm <= 0) throw new RangeError("load must be positive");
  const wire = wireResistance(rho, lengthM, diameterMm);
  const totalR = wire.resistance + loadOhm;
  const current = voltage / totalR;
  const dropWire = current * wire.resistance;
  const dropLoad = current * loadOhm;
  const heatWire = current * current * wire.resistance;
  const powerLoad = current * current * loadOhm;
  return {
    ...wire,
    totalR,
    current,
    dropWire,
    dropLoad,
    heatWire,
    powerLoad,
    fractionDrop: voltage > 0 ? dropWire / voltage : 0,
  };
}
