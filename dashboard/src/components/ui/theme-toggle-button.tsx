"use client";

import React from "react";
import {MoonIcon, SunIcon} from "lucide-react";
import {useTheme} from "next-themes";
import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "./theme-animations";

const startPositions: AnimationStart[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
];

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant;
  showLabel?: boolean;
  url?: string;
}

export function ThemeToggleButton({
  variant = "circle",
  showLabel = false,
  url = "",
}: ThemeToggleAnimationProps) {
  const {theme, setTheme} = useTheme();
  const [randomStart, setRandomStart] =
    React.useState<AnimationStart>("top-left");

  const styleId = "theme-transition-styles";

  const updateStyles = React.useCallback((css: string, name: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newRandomStart = startPositions[
      Math.floor(Math.random() * startPositions.length)
    ] as AnimationStart;
    setRandomStart(newRandomStart);

    const animation = createAnimation(variant, newRandomStart, url);
    updateStyles(animation.css, animation.name);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme, variant, url, updateStyles]);

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 p-0 relative flex items-center justify-center" // Added flex centering
      name="Theme Toggle Button"
      aria-label="Toggle theme"
    >
      {/* Fixed icon positioning */}
      <div className="relative w-5 h-5">
        <SunIcon className="absolute top-0 left-0 w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute top-0 left-0 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>

      {showLabel && (
        <span className="hidden group-hover:block border rounded-full px-2 absolute -bottom-8 text-xs bg-white dark:bg-gray-800 whitespace-nowrap">
          Direction: {randomStart}
        </span>
      )}
    </button>
  );
}
