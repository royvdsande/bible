"use client";

interface CrossProps {
  size?: number;
  className?: string;
}

export default function Cross({ size = 80, className = "" }: CrossProps) {
  const strokeWidth = size * 0.09;
  const armWidth = size * 0.18;
  const cx = size / 2;
  const cy = size / 2;

  // Cross geometry: vertical bar and horizontal bar
  const vTop = size * 0.08;
  const vBottom = size * 0.92;
  const hLeft = size * 0.1;
  const hRight = size * 0.9;
  const hCenter = size * 0.36; // where horizontal bar sits

  const halfArm = armWidth / 2;

  // Cross path as a single shape for a cleaner look
  const crossPath = `
    M ${cx - halfArm} ${vTop + size * 0.04}
    Q ${cx - halfArm} ${vTop} ${cx} ${vTop}
    Q ${cx + halfArm} ${vTop} ${cx + halfArm} ${vTop + size * 0.04}
    L ${cx + halfArm} ${hCenter - halfArm}
    L ${hRight - size * 0.04} ${hCenter - halfArm}
    Q ${hRight} ${hCenter - halfArm} ${hRight} ${hCenter}
    Q ${hRight} ${hCenter + halfArm} ${hRight - size * 0.04} ${hCenter + halfArm}
    L ${cx + halfArm} ${hCenter + halfArm}
    L ${cx + halfArm} ${vBottom - size * 0.04}
    Q ${cx + halfArm} ${vBottom} ${cx} ${vBottom}
    Q ${cx - halfArm} ${vBottom} ${cx - halfArm} ${vBottom - size * 0.04}
    L ${cx - halfArm} ${hCenter + halfArm}
    L ${hLeft + size * 0.04} ${hCenter + halfArm}
    Q ${hLeft} ${hCenter + halfArm} ${hLeft} ${hCenter}
    Q ${hLeft} ${hCenter - halfArm} ${hLeft + size * 0.04} ${hCenter - halfArm}
    L ${cx - halfArm} ${hCenter - halfArm}
    Z
  `;

  const filterId = `cross-glow-${size}`;
  const highlightId = `cross-highlight-${size}`;
  const gradientId = `cross-gradient-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`animate-cross-glow ${className}`}
      aria-label="Kruis"
      role="img"
    >
      <defs>
        {/* Glow filter */}
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size * 0.05} result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.02} result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Main gold gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d78a" />
          <stop offset="40%" stopColor="#D4A853" />
          <stop offset="100%" stopColor="#92631e" />
        </linearGradient>

        {/* Inner highlight gradient */}
        <linearGradient id={highlightId} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer glow layer */}
      <path
        d={crossPath}
        fill={`url(#${gradientId})`}
        filter={`url(#${filterId})`}
        opacity="0.5"
      />

      {/* Main cross body */}
      <path
        d={crossPath}
        fill={`url(#${gradientId})`}
        stroke="rgba(212,168,83,0.15)"
        strokeWidth={strokeWidth * 0.3}
      />

      {/* Highlight sheen on top-left of cross */}
      <path
        d={crossPath}
        fill={`url(#${highlightId})`}
        opacity="0.7"
      />
    </svg>
  );
}
