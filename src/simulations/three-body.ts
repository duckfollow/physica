export type BodyState = { x: number; y: number; vx: number; vy: number; m: number };
export type ThreeBodyPreset = "figure8" | "lagrange" | "hierarchical" | "perturbed";

const SOFTEN = 0.02;

/** Famous figure-eight choreography (normalized equal masses). */
function figure8(): BodyState[] {
  const x1 = 0.97000436, y1 = -0.24308753;
  const vx3 = -0.93240737, vy3 = -0.86473146;
  const vx1 = 0.466203685, vy1 = 0.43236573;
  return [
    { x: x1, y: y1, vx: vx1, vy: vy1, m: 1 },
    { x: -x1, y: -y1, vx: vx1, vy: vy1, m: 1 },
    { x: 0, y: 0, vx: vx3, vy: vy3, m: 1 },
  ];
}

function lagrange(): BodyState[] {
  const r = 1, omega = Math.sqrt(1 / (Math.sqrt(3) * r * r * r));
  return [0, 1, 2].map((i) => {
    const a = (i * 2 * Math.PI) / 3;
    return {
      x: r * Math.cos(a),
      y: r * Math.sin(a),
      vx: -omega * r * Math.sin(a),
      vy: omega * r * Math.cos(a),
      m: 1,
    };
  });
}

function hierarchical(): BodyState[] {
  return [
    { x: 0, y: 0, vx: 0, vy: 0, m: 4 },
    { x: 1.2, y: 0, vx: 0, vy: 1.55, m: 1 },
    { x: -2.2, y: 0, vx: 0, vy: -0.85, m: 1 },
  ];
}

export function threeBodyInitial(preset: ThreeBodyPreset): BodyState[] {
  if (preset === "figure8") return figure8();
  if (preset === "lagrange") return lagrange();
  if (preset === "hierarchical") return hierarchical();
  const base = figure8();
  base[0].vx += 0.035;
  base[0].vy -= 0.02;
  return base;
}

function accelerations(bodies: BodyState[]) {
  const ax = [0, 0, 0], ay = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      const dx = bodies[j].x - bodies[i].x;
      const dy = bodies[j].y - bodies[i].y;
      const dist2 = dx * dx + dy * dy + SOFTEN * SOFTEN;
      const inv = 1 / (dist2 * Math.sqrt(dist2));
      const fx = dx * inv, fy = dy * inv;
      ax[i] += bodies[j].m * fx;
      ay[i] += bodies[j].m * fy;
      ax[j] -= bodies[i].m * fx;
      ay[j] -= bodies[i].m * fy;
    }
  }
  return { ax, ay };
}

export function threeBodyEnergy(bodies: BodyState[]) {
  let kinetic = 0, potential = 0;
  for (let i = 0; i < 3; i++) {
    kinetic += 0.5 * bodies[i].m * (bodies[i].vx ** 2 + bodies[i].vy ** 2);
    for (let j = i + 1; j < 3; j++) {
      const dx = bodies[j].x - bodies[i].x;
      const dy = bodies[j].y - bodies[i].y;
      potential -= (bodies[i].m * bodies[j].m) / Math.hypot(dx, dy, SOFTEN);
    }
  }
  return kinetic + potential;
}

/** Integrate three bodies with velocity Verlet; returns trails and final state. */
export function threeBodyPath(preset: ThreeBodyPreset, steps = 5000, dt = 0.002) {
  const bodies = threeBodyInitial(preset).map((b) => ({ ...b }));
  const trails = [[], [], []] as { x: number; y: number }[][];
  let { ax, ay } = accelerations(bodies);
  const e0 = threeBodyEnergy(bodies);
  for (let step = 0; step <= steps; step++) {
    for (let i = 0; i < 3; i++) trails[i].push({ x: bodies[i].x, y: bodies[i].y });
    for (let i = 0; i < 3; i++) {
      bodies[i].x += bodies[i].vx * dt + 0.5 * ax[i] * dt * dt;
      bodies[i].y += bodies[i].vy * dt + 0.5 * ay[i] * dt * dt;
    }
    const next = accelerations(bodies);
    for (let i = 0; i < 3; i++) {
      bodies[i].vx += 0.5 * (ax[i] + next.ax[i]) * dt;
      bodies[i].vy += 0.5 * (ay[i] + next.ay[i]) * dt;
    }
    ax = next.ax;
    ay = next.ay;
  }
  const e1 = threeBodyEnergy(bodies);
  return {
    trails,
    bodies,
    dt,
    energyDrift: Math.abs(e1 - e0) / Math.max(1e-9, Math.abs(e0)),
    initialEnergy: e0,
    finalEnergy: e1,
  };
}
