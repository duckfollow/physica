/** Linear function y = mx + c */
export function linearValue(m: number, c: number, x: number) {
  return m * x + c;
}

export function linearRoot(m: number, c: number) {
  if (Math.abs(m) < 1e-12) return c === 0 ? Infinity : null;
  return -c / m;
}

/** Quadratic y = ax² + bx + c */
export function quadraticValue(a: number, b: number, c: number, x: number) {
  return a * x * x + b * x + c;
}

export function quadraticVertex(a: number, b: number, c: number) {
  if (Math.abs(a) < 1e-12) return { x: 0, y: c };
  const x = -b / (2 * a);
  return { x, y: quadraticValue(a, b, c, x) };
}

export function quadraticDiscriminant(a: number, b: number, c: number) {
  return b * b - 4 * a * c;
}

export function quadraticRoots(a: number, b: number, c: number) {
  if (Math.abs(a) < 1e-12) {
    const r = linearRoot(b, c);
    return r === null ? [] : [r];
  }
  const d = quadraticDiscriminant(a, b, c);
  if (d < 0) return [];
  if (Math.abs(d) < 1e-12) return [-b / (2 * a)];
  const s = Math.sqrt(d);
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((x, y) => x - y);
}

/** Right triangle from angle (degrees) and hypotenuse. */
export function rightTriangle(angleDeg: number, hypotenuse: number) {
  const theta = (angleDeg * Math.PI) / 180;
  const opposite = hypotenuse * Math.sin(theta);
  const adjacent = hypotenuse * Math.cos(theta);
  return {
    theta,
    opposite,
    adjacent,
    sin: opposite / hypotenuse,
    cos: adjacent / hypotenuse,
    tan: opposite / Math.max(1e-12, adjacent),
  };
}

/** Fair die / coin probability helpers. */
export function coinProbability(headsTarget: number, flips: number) {
  const n = Math.max(0, Math.floor(flips));
  const k = Math.min(n, Math.max(0, Math.floor(headsTarget)));
  // P(exactly k heads) binomial
  let comb = 1;
  for (let i = 1; i <= k; i++) comb *= (n - k + i) / i;
  const p = comb * Math.pow(0.5, n);
  return { n, k, p, expectedHeads: n * 0.5 };
}

export function dieProbability(faces: number, target: number) {
  const f = Math.max(2, Math.floor(faces));
  const t = Math.floor(target);
  const p = t >= 1 && t <= f ? 1 / f : 0;
  return { faces: f, target: t, p, complementary: 1 - p };
}

/** Exponential y = a · bˣ */
export function exponentialValue(a: number, base: number, x: number) {
  const b = Math.max(0.05, base);
  return a * b ** x;
}

export function exponentialGrowth(base: number) {
  if (base > 1 + 1e-12) return "growth" as const;
  if (base < 1 - 1e-12 && base > 0) return "decay" as const;
  return "flat" as const;
}

/** Absolute value V-graph y = a|x − h| + k */
export function absoluteValue(a: number, h: number, k: number, x: number) {
  return a * Math.abs(x - h) + k;
}

export function absoluteVertex(h: number, k: number) {
  return { x: h, y: k };
}

/** Reciprocal / rational y = a/(x − h) + k with vertical asymptote x = h */
export function reciprocalValue(a: number, h: number, k: number, x: number) {
  const d = x - h;
  if (Math.abs(d) < 1e-9) return Number.NaN;
  return a / d + k;
}

export function reciprocalAsymptotes(h: number, k: number) {
  return { vertical: h, horizontal: k };
}

/** Sample a function into one or more polyline segments, skipping non-finite / clipped y. */
export function sampleGraph(
  fn: (x: number) => number,
  xMin = -10,
  xMax = 10,
  steps = 120,
  yClip = 14,
) {
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > yClip) {
      if (current.length > 1) segments.push(current);
      current = [];
      continue;
    }
    current.push({ x, y });
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

/** Trapezoidal area under y=f(x) on [left,right]. */
export function areaUnderQuadratic(a: number, b: number, c: number, left: number, right: number, slices = 40) {
  const lo = Math.min(left, right), hi = Math.max(left, right);
  if (hi - lo < 1e-12) return { approx: 0, exact: 0, width: 0 };
  const n = Math.max(4, slices);
  const dx = (hi - lo) / n;
  let sum = 0.5 * (quadraticValue(a, b, c, lo) + quadraticValue(a, b, c, hi));
  for (let i = 1; i < n; i++) sum += quadraticValue(a, b, c, lo + i * dx);
  const approx = sum * dx;
  const F = (x: number) => (a * x * x * x) / 3 + (b * x * x) / 2 + c * x;
  const exact = F(hi) - F(lo);
  return { approx, exact, width: hi - lo };
}
