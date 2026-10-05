import { BrandMark } from "./brand-mark";

const rings = [
  { angle: -30, color: "#315b43", duration: "9s", delay: "-2s" },
  { angle: 28, color: "#7698b1", duration: "12s", delay: "-6s" },
  { angle: 78, color: "#da7954", duration: "15s", delay: "-10s" },
];

/** Decorative atom: one coordinate system keeps every orbit and nucleus aligned. */
export function AtomArt() {
  return (
    <div className="orbit-art atom-art" aria-hidden="true">
      <svg className="atom-scene" viewBox="0 0 440 340" fill="none" focusable="false">
        {rings.map(({ angle, color, duration, delay }) => (
          <g key={angle} transform={`translate(220 170) rotate(${angle})`}>
            <ellipse rx="155" ry="70" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <g className="atom-moving-dot">
              <animateMotion dur={duration} begin={delay} repeatCount="indefinite" calcMode="paced" path="M155 0 A155 70 0 1 1 -155 0 A155 70 0 1 1 155 0" />
              <circle r="12" fill={color} opacity="0.13" />
              <circle r="6" fill={color} />
            </g>
            <g className="atom-static-dot" transform="translate(155 0)">
              <circle r="12" fill={color} opacity="0.13" />
              <circle r="6" fill={color} />
            </g>
          </g>
        ))}
        <g transform="translate(192 142)"><BrandMark size={56} color="#da7954" /></g>
      </svg>
      <span className="art-label">CHANGE ONE THING. DISCOVER SOMETHING.</span>
    </div>
  );
}
