// PlateSpinner.tsx
import React from "react";

type Props = {
  size?: number;
  thickness?: number;
  className?: string;
  label?: string;
};

export const PlateSpinner: React.FC<Props> = ({
  size = 48,
  thickness = 4,
  className = "",
  label,
}) => {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div
      className={`flex flex-col items-center ${className}`}
      role="status"
      aria-busy="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* plate background */}
          <circle
            r={r}
            fill="transparent"
            stroke="var(--tw-ring-color, #e5e7eb)"
            strokeWidth={thickness}
            opacity="0.6"
          />

          {/* rotating stroke */}
          <circle
            r={r}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeDasharray={`${circ * 0.25} ${circ}`}
            strokeLinecap="round"
            style={{
              transformOrigin: "center",
              animation: "spin 1s linear infinite",
            }}
          />

          {/* fork (left) */}
          <rect
            x={-r * 0.55}
            y={-r * 0.2}
            width={2}
            height={r * 0.9}
            rx="1"
            transform="rotate(-18)"
            fill="currentColor"
            opacity="0.9"
          />
          {/* knife (right) */}
          <rect
            x={r * 0.2}
            y={-r * 0.35}
            width={2.6}
            height={r * 0.95}
            rx="1"
            transform="rotate(18)"
            fill="currentColor"
            opacity="0.9"
          />
        </g>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg);} }
        `}</style>
      </svg>

      {label ? (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {label}
        </div>
      ) : null}
    </div>
  );
};

export default PlateSpinner;
