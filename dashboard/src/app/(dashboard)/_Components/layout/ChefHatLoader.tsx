// ChefHatLoader.tsx
import React from "react";

type Props = {
  size?: number; // px
  text?: string;
  className?: string;
};

const ChefHatLoader: React.FC<Props> = ({
  size = 96,
  text = "Loading...",
  className = "",
}) => {
  const s = size;
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hatGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#f3f4f6" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* plate */}
        <ellipse
          cx="64"
          cy="96"
          rx="44"
          ry="12"
          fill="#F9FAFB"
          className="dark:fill-gray-700"
          opacity="0.9"
        />

        {/* chef hat body */}
        <g transform="translate(18,12)">
          <path
            d="M30 20c-10 0-18 8-18 18 0 10 8 18 18 18h50c10 0 18-8 18-18 0-10-8-18-18-18-2 0-4 0-6 .6-4-9-12-16-22-16-9 0-17 6-21.6 14-2.2-1-4.6-1.6-7.4-1.6z"
            fill="url(#hatGrad)"
            stroke="#e5e7eb"
            strokeWidth="1"
            className="dark:stroke-gray-600"
          />
          {/* rim */}
          <rect
            x="0"
            y="58"
            width="92"
            height="6"
            rx="3"
            fill="#fff"
            stroke="#e6e6e6"
            className="dark:fill-gray-800 dark:stroke-gray-600"
          />
        </g>

        {/* steam lines - animated */}
        <g transform="translate(58,18)">
          <path
            className="steam s1"
            d="M2 2 C8 6, 8 14, 2 18"
            stroke="#D1D5DB"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="steam s2"
            d="M16 2 C22 6, 22 14, 16 18"
            stroke="#D1D5DB"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <style>{`
          .steam { opacity: 0; transform-origin: center; }
          .steam.s1 { animation: steamUp 1.6s infinite ease-in-out; animation-delay: 0s; }
          .steam.s2 { animation: steamUp 1.6s infinite ease-in-out; animation-delay: 0.4s; }

          @keyframes steamUp {
            0%   { opacity: 0; transform: translateY(6px) scale(0.9); }
            20%  { opacity: 0.6; transform: translateY(0px) scale(1); }
            60%  { opacity: 0.4; transform: translateY(-6px) scale(1.05); }
            100% { opacity: 0; transform: translateY(-12px) scale(1.12); }
          }
        `}</style>
      </svg>

      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {text}
      </div>
    </div>
  );
};

export default ChefHatLoader;
