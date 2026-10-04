import type { SimulationId } from "@/content/simulations";

type Subject = "physics" | "biology" | "chemistry" | "math";

const PALETTE: Record<Subject, { a: string; b: string; ink: string; blob: string }> = {
  physics: { a: "#dfe8d8", b: "#c5d6c4", ink: "#2f5b43", blob: "#ffffff55" },
  biology: { a: "#d7ebe0", b: "#b7d8c6", ink: "#2a6849", blob: "#ffffff55" },
  chemistry: { a: "#f0e4d6", b: "#e0c9b2", ink: "#8a4e2d", blob: "#ffffff55" },
  math: { a: "#dde7f0", b: "#c2d2e4", ink: "#355872", blob: "#ffffff55" },
};

function subjectOf(topic: string): Subject {
  if (topic === "ชีววิทยา") return "biology";
  if (topic === "เคมี") return "chemistry";
  if (topic === "คณิตศาสตร์") return "math";
  return "physics";
}

function Motif({ id }: { id: SimulationId }) {
  switch (id) {
    case "wave":
      return <path d="M24 78 C48 40, 72 116, 96 78 S144 40, 168 78 S216 116, 240 78 S288 40, 312 78" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "pendulum":
      return <><line x1="160" y1="28" x2="118" y2="108" stroke="currentColor" strokeWidth="4" /><circle cx="118" cy="108" r="14" fill="currentColor" /></>;
    case "orbit":
      return <><ellipse cx="160" cy="76" rx="88" ry="36" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(-18 160 76)" /><circle cx="160" cy="76" r="16" fill="currentColor" /><circle cx="236" cy="54" r="7" fill="currentColor" /></>;
    case "projectile":
      return <path d="M36 118 Q160 18 284 118" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "force":
      return <><rect x="118" y="58" width="52" height="40" rx="8" fill="currentColor" opacity="0.25" /><path d="M170 78 H268" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M248 62 L274 78 L248 94" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></>;
    case "coaster":
      return <path d="M28 48 C80 48, 100 120, 160 120 S240 48, 300 48" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />;
    case "buoyancy":
      return <><rect x="100" y="70" width="120" height="54" rx="10" fill="currentColor" opacity="0.22" /><path d="M40 96 H280" stroke="currentColor" strokeWidth="4" /><rect x="118" y="58" width="84" height="48" rx="8" fill="currentColor" opacity="0.55" /></>;
    case "refraction":
      return <><line x1="70" y1="30" x2="160" y2="76" stroke="currentColor" strokeWidth="4" /><line x1="160" y1="76" x2="250" y2="130" stroke="currentColor" strokeWidth="4" /><line x1="40" y1="76" x2="280" y2="76" stroke="currentColor" strokeWidth="2" opacity="0.45" /></>;
    case "lens":
      return <><ellipse cx="160" cy="76" rx="14" ry="52" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="3" /><line x1="70" y1="40" x2="160" y2="76" stroke="currentColor" strokeWidth="3" /><line x1="160" y1="76" x2="250" y2="40" stroke="currentColor" strokeWidth="3" /></>;
    case "circuit":
      return <><rect x="70" y="48" width="180" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="100" cy="78" r="8" fill="currentColor" /><circle cx="160" cy="78" r="8" fill="currentColor" /><circle cx="220" cy="78" r="8" fill="currentColor" /></>;
    case "motor":
      return <><circle cx="160" cy="76" r="46" fill="none" stroke="currentColor" strokeWidth="5" /><line x1="160" y1="76" x2="198" y2="48" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><circle cx="160" cy="76" r="8" fill="currentColor" /></>;
    case "heat":
      return <><rect x="70" y="40" width="70" height="90" rx="10" fill="currentColor" opacity="0.2" /><rect x="180" y="40" width="70" height="90" rx="10" fill="currentColor" opacity="0.35" /><path d="M140 85 H180" stroke="currentColor" strokeWidth="4" /></>;
    case "quantum":
      return <><path d="M50 110 C90 30, 130 30, 160 76 S230 122, 270 40" fill="none" stroke="currentColor" strokeWidth="4" /><line x1="50" y1="120" x2="270" y2="120" stroke="currentColor" strokeWidth="3" opacity="0.4" /></>;
    case "half-life":
      return <path d="M50 40 C90 40, 110 120, 160 120 S230 40, 270 40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "web-swing":
      return <><line x1="160" y1="28" x2="220" y2="110" stroke="currentColor" strokeWidth="3" /><circle cx="220" cy="110" r="10" fill="currentColor" /><path d="M220 110 Q250 90 280 120" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" /></>;
    case "incline":
      return <><polygon points="60,120 260,120 260,48" fill="currentColor" opacity="0.15" /><line x1="60" y1="120" x2="260" y2="48" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><rect x="168" y="62" width="28" height="20" rx="4" fill="currentColor" transform="rotate(-20 182 72)" /></>;
    case "collision":
      return <><circle cx="118" cy="76" r="22" fill="currentColor" opacity="0.35" /><circle cx="202" cy="76" r="22" fill="currentColor" /><path d="M70 76 H92 M228 76 H250" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></>;
    case "braking":
      return <><rect x="70" y="88" width="180" height="16" rx="4" fill="currentColor" opacity="0.2" /><rect x="90" y="60" width="46" height="28" rx="6" fill="currentColor" /><line x1="140" y1="74" x2="230" y2="74" stroke="currentColor" strokeWidth="4" strokeDasharray="8 6" /></>;
    case "lift":
      return <path d="M60 90 C120 50, 200 45, 270 80" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />;
    case "torque":
      return <><line x1="100" y1="40" x2="100" y2="120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" /><line x1="100" y1="80" x2="230" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" /><path d="M230 80 L250 58" stroke="currentColor" strokeWidth="4" /></>;
    case "osmosis":
      return <><circle cx="160" cy="76" r="48" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="160" cy="76" r="30" fill="currentColor" opacity="0.25" /><circle cx="148" cy="68" r="10" fill="currentColor" opacity="0.45" /></>;
    case "enzyme":
      return <><path d="M70 100 C100 40, 140 40, 160 76 S220 112, 250 50" fill="none" stroke="currentColor" strokeWidth="5" /><circle cx="160" cy="76" r="10" fill="currentColor" /></>;
    case "photosynthesis":
      return <><circle cx="230" cy="42" r="18" fill="currentColor" opacity="0.35" /><path d="M110 110 C130 50, 170 40, 200 70 C220 92, 210 120, 160 120 C120 120, 100 110, 110 110Z" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="3" /></>;
    case "mendel":
      return <><rect x="70" y="40" width="50" height="80" rx="8" fill="currentColor" opacity="0.25" /><rect x="135" y="40" width="50" height="80" rx="8" fill="currentColor" opacity="0.45" /><rect x="200" y="40" width="50" height="80" rx="8" fill="currentColor" opacity="0.7" /></>;
    case "predator-prey":
      return <><path d="M50 100 C90 40, 130 40, 160 76 S230 112, 270 50" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M50 110 C100 120, 150 30, 200 70 S260 110, 290 60" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.55" /></>;
    case "acid-base":
      return <><path d="M130 36 H190 L210 120 H110 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3" /><path d="M120 88 H200" stroke="currentColor" strokeWidth="3" opacity="0.5" /></>;
    case "reaction-rate":
      return <><rect x="90" y="70" width="40" height="50" rx="6" fill="currentColor" opacity="0.3" /><rect x="145" y="50" width="40" height="70" rx="6" fill="currentColor" opacity="0.5" /><rect x="200" y="30" width="40" height="90" rx="6" fill="currentColor" /></>;
    case "equilibrium":
      return <><rect x="70" y="50" width="70" height="70" rx="10" fill="currentColor" opacity="0.3" /><rect x="180" y="50" width="70" height="70" rx="10" fill="currentColor" opacity="0.65" /><path d="M148 70 H172 M148 90 H172" stroke="currentColor" strokeWidth="3" /></>;
    case "ideal-gas":
      return <><rect x="100" y="40" width="120" height="90" rx="12" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="130" cy="70" r="6" fill="currentColor" /><circle cx="170" cy="95" r="6" fill="currentColor" /><circle cx="195" cy="62" r="6" fill="currentColor" /></>;
    case "titration":
      return <path d="M50 110 C90 110, 110 30, 160 30 S230 110, 270 110" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "linear":
      return <><line x1="60" y1="110" x2="260" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><circle cx="160" cy="75" r="6" fill="currentColor" /></>;
    case "quadratic":
      return <path d="M50 110 Q160 20 270 110" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "trigonometry":
      return <><polygon points="80,120 240,120 240,40" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="4" /><circle cx="100" cy="104" r="10" fill="none" stroke="currentColor" strokeWidth="3" /></>;
    case "probability":
      return <><circle cx="120" cy="76" r="28" fill="none" stroke="currentColor" strokeWidth="4" /><rect x="176" y="48" width="56" height="56" rx="10" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="4" /><circle cx="204" cy="76" r="6" fill="currentColor" /></>;
    case "area":
      return <><path d="M60 110 Q160 30 260 90 L260 120 L60 120 Z" fill="currentColor" opacity="0.22" /><path d="M60 110 Q160 30 260 90" fill="none" stroke="currentColor" strokeWidth="4" /></>;
    default:
      return <circle cx="160" cy="76" r="34" fill="currentColor" opacity="0.25" />;
  }
}

export function SimCover({ id, topic }: { id: SimulationId; topic: string }) {
  const subject = subjectOf(topic);
  const palette = PALETTE[subject];
  const gradId = `cover-grad-${id}`;
  return (
    <div className={`sim-art art-subject-${subject}`} aria-hidden="true">
      <svg className="sim-cover-svg" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.a} />
            <stop offset="100%" stopColor={palette.b} />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill={`url(#${gradId})`} />
        <circle cx="278" cy="18" r="72" fill={palette.blob} />
        <circle cx="24" cy="138" r="58" fill={palette.blob} />
        <g style={{ color: palette.ink }}>
          <Motif id={id} />
        </g>
      </svg>
    </div>
  );
}
