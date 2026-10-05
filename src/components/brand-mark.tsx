/** Vector artwork avoids platform-specific emoji and font substitution. */
export function BrandMark({ size = 32, color = "currentColor", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className={className} style={{ display: "block", flexShrink: 0 }}>
      <path d="M16 3V29M3 16H29M6.8 6.8L25.2 25.2M6.8 25.2L25.2 6.8" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3" fill={color} />
    </svg>
  );
}
