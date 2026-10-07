import type { SimulationId } from "@/content/simulations";
import { coverSubjectOf } from "@/content/subjects";

type Subject = "physics" | "biology" | "chemistry" | "math";

const PALETTE: Record<Subject, { a: string; b: string; ink: string; blob: string }> = {
  physics: { a: "#dfe8d8", b: "#c5d6c4", ink: "#2f5b43", blob: "#ffffff55" },
  biology: { a: "#d7ebe0", b: "#b7d8c6", ink: "#2a6849", blob: "#ffffff55" },
  chemistry: { a: "#f0e4d6", b: "#e0c9b2", ink: "#8a4e2d", blob: "#ffffff55" },
  math: { a: "#dde7f0", b: "#c2d2e4", ink: "#355872", blob: "#ffffff55" },
};

function Motif({ id }: { id: SimulationId }) {
  switch (id) {
    case "water-cycle": return <><circle cx="70" cy="40" r="20" fill="#e9b557"/><ellipse cx="190" cy="55" rx="55" ry="22" fill="#cbd5dd"/><path d="M35 115Q140 90 280 115V145H35Z" fill="#5c9eb5"/><path d="M100 90L115 60M180 85L170 107M205 85L195 107" stroke="currentColor" strokeWidth="4"/></>;
    case "earth": return <>{[64,58,34,13].map((r,i)=><circle key={r} cx="160" cy="75" r={r} fill={["#63946c","#d9924c","#cf593b","#f1cb70"][i]}/>)}</>;
    case "fiber":
      return <><rect x="30" y="55" width="260" height="40" rx="20" fill="currentColor" opacity="0.15"/><path d="M35 75H285" stroke="currentColor" strokeWidth="5"/>{[85,145,225].map(x=><circle key={x} cx={x} cy="75" r="9" fill="#dc8b49"/>)}</>;
    case "wave":
      return <path d="M24 78 C48 40, 72 116, 96 78 S144 40, 168 78 S216 116, 240 78 S288 40, 312 78" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "pendulum":
      return <><line x1="160" y1="28" x2="118" y2="108" stroke="currentColor" strokeWidth="4" /><circle cx="118" cy="108" r="14" fill="currentColor" /></>;
    case "orbit":
      return <><ellipse cx="160" cy="76" rx="88" ry="36" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(-18 160 76)" /><circle cx="160" cy="76" r="16" fill="currentColor" /><circle cx="236" cy="54" r="7" fill="currentColor" /></>;
    case "three-body":
      return <><path d="M70 90 C110 30, 150 30, 160 76 S210 122, 250 50" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="92" cy="72" r="8" fill="currentColor" /><circle cx="160" cy="76" r="8" fill="currentColor" /><circle cx="228" cy="68" r="8" fill="currentColor" /></>;
    case "projectile":
      return <path d="M36 118 Q160 18 284 118" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "force":
      return <><rect x="118" y="58" width="52" height="40" rx="8" fill="currentColor" opacity="0.25" /><path d="M170 78 H268" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M248 62 L274 78 L248 94" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></>;
    case "coaster":
      return <path d="M28 48 C80 48, 100 120, 160 120 S240 48, 300 48" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />;
    case "buoyancy":
      return <><rect x="100" y="70" width="120" height="54" rx="10" fill="currentColor" opacity="0.22" /><path d="M40 96 H280" stroke="currentColor" strokeWidth="4" /><rect x="118" y="58" width="84" height="48" rx="8" fill="currentColor" opacity="0.55" /></>;
    case "pressure":
      return <><rect x="110" y="36" width="100" height="96" rx="8" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="3" /><rect x="128" y="88" width="64" height="10" rx="3" fill="currentColor" /><path d="M160 58 V82" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="M150 72 L160 84 L170 72" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></>;
    case "barometer":
      return <><rect x="130" y="100" width="60" height="28" rx="6" fill="currentColor" opacity="0.25" /><path d="M148 100 V36 H172 V100" fill="none" stroke="currentColor" strokeWidth="5" /><rect x="152" y="58" width="16" height="42" fill="currentColor" opacity="0.55" /></>;
    case "double-slit":
      return <><rect x="70" y="36" width="14" height="28" fill="currentColor" opacity="0.45" /><rect x="70" y="72" width="14" height="12" fill="currentColor" opacity="0.45" /><rect x="70" y="92" width="14" height="28" fill="currentColor" opacity="0.45" /><rect x="230" y="36" width="20" height="90" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3" /><path d="M84 68 H230 M84 88 H230" stroke="currentColor" strokeWidth="3" opacity="0.6" /></>;
    case "spectrum":
      return <><polygon points="90,40 140,120 90,120" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3" /><path d="M50 80 H90" stroke="currentColor" strokeWidth="4" /><path d="M140 90 L260 50" stroke="currentColor" strokeWidth="3" opacity="0.45" /><path d="M140 100 L260 90" stroke="currentColor" strokeWidth="3" opacity="0.65" /><path d="M140 110 L260 130" stroke="currentColor" strokeWidth="3" opacity="0.85" /></>;
    case "rutherford":
      return <><circle cx="160" cy="76" r="12" fill="currentColor" /><path d="M50 50 Q120 70 150 76 T280 40" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M50 110 Q130 90 155 80" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" /></>;
    case "refraction":
      return <><line x1="70" y1="30" x2="160" y2="76" stroke="currentColor" strokeWidth="4" /><line x1="160" y1="76" x2="250" y2="130" stroke="currentColor" strokeWidth="4" /><line x1="40" y1="76" x2="280" y2="76" stroke="currentColor" strokeWidth="2" opacity="0.45" /></>;
    case "lens":
      return <><ellipse cx="160" cy="76" rx="14" ry="52" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="3" /><line x1="70" y1="40" x2="160" y2="76" stroke="currentColor" strokeWidth="3" /><line x1="160" y1="76" x2="250" y2="40" stroke="currentColor" strokeWidth="3" /></>;
    case "ohm":
    case "circuit":
      return <><rect x="70" y="48" width="180" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="100" cy="78" r="8" fill="currentColor" /><circle cx="160" cy="78" r="8" fill="currentColor" /><circle cx="220" cy="78" r="8" fill="currentColor" /></>;
    case "wire":
      return <><path d="M40 76 H280" stroke="currentColor" strokeWidth="14" strokeLinecap="round" opacity="0.25" /><path d="M40 76 H280" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><circle cx="90" cy="76" r="5" fill="currentColor" /><circle cx="160" cy="76" r="5" fill="currentColor" /><circle cx="230" cy="76" r="5" fill="currentColor" /></>;
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
    case "elements":
      return <><rect x="70" y="40" width="40" height="40" rx="6" fill="currentColor" opacity="0.25" /><rect x="120" y="40" width="40" height="40" rx="6" fill="currentColor" opacity="0.4" /><rect x="170" y="40" width="40" height="40" rx="6" fill="currentColor" opacity="0.55" /><rect x="220" y="40" width="40" height="40" rx="6" fill="currentColor" opacity="0.7" /><rect x="70" y="90" width="40" height="40" rx="6" fill="currentColor" opacity="0.35" /><rect x="120" y="90" width="40" height="40" rx="6" fill="currentColor" opacity="0.5" /><text x="90" y="66" textAnchor="middle" fontSize="14" fill="currentColor">Na</text><text x="240" y="66" textAnchor="middle" fontSize="14" fill="currentColor">Ar</text></>;
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
    case "exponential":
      return <path d="M50 120 C90 118, 120 110, 150 90 S220 30, 270 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "absolute":
      return <path d="M50 40 L160 120 L270 40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
    case "reciprocal":
      return <><path d="M40 40 C80 40, 100 120, 150 120" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M170 40 C220 40, 240 120, 280 120" fill="none" stroke="currentColor" strokeWidth="4" /><line x1="160" y1="30" x2="160" y2="130" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" /></>;
    case "trigonometry":
      return <><polygon points="80,120 240,120 240,40" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="4" /><circle cx="100" cy="104" r="10" fill="none" stroke="currentColor" strokeWidth="3" /></>;
    case "probability":
      return <><circle cx="120" cy="76" r="28" fill="none" stroke="currentColor" strokeWidth="4" /><rect x="176" y="48" width="56" height="56" rx="10" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="4" /><circle cx="204" cy="76" r="6" fill="currentColor" /></>;
    case "area":
      return <><path d="M60 110 Q160 30 260 90 L260 120 L60 120 Z" fill="currentColor" opacity="0.22" /><path d="M60 110 Q160 30 260 90" fill="none" stroke="currentColor" strokeWidth="4" /></>;
    case "sine":
      return <path d="M40 76 C70 20, 100 132, 130 76 S190 20, 220 76 S280 132, 300 76" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
    case "doppler":
      return <><circle cx="90" cy="76" r="16" fill="currentColor" opacity="0.35" /><path d="M120 76 H250" stroke="currentColor" strokeWidth="4" /><circle cx="160" cy="76" r="22" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" /><circle cx="200" cy="76" r="34" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" /></>;
    case "coulomb":
      return <><circle cx="110" cy="76" r="22" fill="currentColor" opacity="0.35" /><circle cx="210" cy="76" r="22" fill="currentColor" /><path d="M140 76 H180" stroke="currentColor" strokeWidth="4" /><path d="M70 76 H88 M232 76 H250" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></>;
    case "conduction":
      return <><rect x="70" y="50" width="180" height="52" rx="8" fill="currentColor" opacity="0.2" /><rect x="70" y="50" width="60" height="52" fill="currentColor" opacity="0.55" /><rect x="190" y="50" width="60" height="52" fill="currentColor" opacity="0.25" /></>;
    case "dna":
      return <><path d="M90 40 C120 60, 120 90, 90 110" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M230 40 C200 60, 200 90, 230 110" fill="none" stroke="currentColor" strokeWidth="4" /><line x1="105" y1="55" x2="215" y2="55" stroke="currentColor" strokeWidth="3" /><line x1="105" y1="80" x2="215" y2="80" stroke="currentColor" strokeWidth="3" /><line x1="105" y1="105" x2="215" y2="105" stroke="currentColor" strokeWidth="3" /></>;
    case "foucault":
      return <><ellipse cx="160" cy="88" rx="70" ry="28" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" /><line x1="160" y1="30" x2="200" y2="100" stroke="currentColor" strokeWidth="4" /><circle cx="200" cy="100" r="10" fill="currentColor" /></>;
    case "brownian":
      return <path d="M60 90 L90 60 L120 95 L150 50 L180 100 L210 70 L250 88" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
    case "oersted":
      return <><line x1="160" y1="30" x2="160" y2="130" stroke="currentColor" strokeWidth="8" strokeLinecap="round" /><circle cx="160" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="160" cy="80" r="48" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.45" /><line x1="210" y1="80" x2="210" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></>;
    case "magnet":
      return <><rect x="50" y="55" width="90" height="40" rx="8" fill="currentColor" opacity="0.35" /><rect x="50" y="55" width="45" height="40" rx="8" fill="currentColor" /><rect x="180" y="55" width="90" height="40" rx="8" fill="currentColor" opacity="0.35" /><rect x="225" y="55" width="45" height="40" rx="8" fill="currentColor" /><path d="M140 75 C150 50, 170 50, 180 75" fill="none" stroke="currentColor" strokeWidth="3" /></>;
    case "lorentz":
      return <><circle cx="160" cy="76" r="40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" /><circle cx="200" cy="76" r="8" fill="currentColor" /><text x="70" y="50" fill="currentColor" fontSize="18">×</text><text x="100" y="110" fill="currentColor" fontSize="18">×</text><text x="230" y="50" fill="currentColor" fontSize="18">×</text></>;
    case "faraday":
      return <><ellipse cx="120" cy="76" rx="36" ry="22" fill="none" stroke="currentColor" strokeWidth="4" /><rect x="190" y="40" width="70" height="70" rx="10" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3" /><line x1="225" y1="75" x2="250" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></>;
    case "bond":
      return <><circle cx="110" cy="76" r="28" fill="currentColor" opacity="0.35" /><circle cx="210" cy="76" r="28" fill="currentColor" /><ellipse cx="160" cy="76" rx="36" ry="18" fill="currentColor" opacity="0.25" /></>;
    case "ionic":
      return <><circle cx="110" cy="76" r="26" fill="currentColor" /><circle cx="210" cy="76" r="26" fill="currentColor" opacity="0.35" /><text x="110" y="82" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">+</text><text x="210" y="82" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">−</text></>;
    case "lewis":
      return <><circle cx="160" cy="76" r="22" fill="currentColor" opacity="0.3" /><circle cx="100" cy="76" r="16" fill="currentColor" /><circle cx="220" cy="76" r="16" fill="currentColor" /><line x1="116" y1="76" x2="138" y2="76" stroke="currentColor" strokeWidth="4" /><line x1="182" y1="76" x2="204" y2="76" stroke="currentColor" strokeWidth="4" /><circle cx="160" cy="48" r="3" fill="currentColor" /><circle cx="160" cy="104" r="3" fill="currentColor" /></>;
    default:
      return <circle cx="160" cy="76" r="34" fill="currentColor" opacity="0.25" />;
  }
}

export function SimCover({ id, topic }: { id: SimulationId; topic: string }) {
  const subject = coverSubjectOf(topic);
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
