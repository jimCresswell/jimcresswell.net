"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Known pattern to avoid hydration mismatch with theme
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch
    return (
      <div
        className="flex items-center gap-[clamp(0.125rem,0.5vw,0.5rem)] print-hidden"
        aria-hidden="true"
      >
        <span className="opacity-50">Light</span>
        <span className="opacity-50" aria-hidden="true">
          ·
        </span>
        <span className="opacity-50">Dark</span>
        <span className="opacity-50" aria-hidden="true">
          ·
        </span>
        <span className="opacity-50">Auto</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-[clamp(0.125rem,0.5vw,0.5rem)] print-hidden"
      role="group"
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`min-h-11 min-w-11 flex items-center justify-center transition-opacity hover:opacity-100 ${
          theme === "light" ? "font-medium underline" : "opacity-70"
        }`}
        aria-pressed={theme === "light"}
      >
        Light
      </button>
      <span className="opacity-50" aria-hidden="true">
        ·
      </span>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`min-h-11 min-w-11 flex items-center justify-center transition-opacity hover:opacity-100 ${
          theme === "dark" ? "font-medium underline" : "opacity-70"
        }`}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
      <span className="opacity-50" aria-hidden="true">
        ·
      </span>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`min-h-11 min-w-11 flex items-center justify-center transition-opacity hover:opacity-100 ${
          theme === "system" ? "font-medium underline" : "opacity-70"
        }`}
        aria-pressed={theme === "system"}
      >
        Auto
      </button>
      <div className="sr-only" aria-live="polite">
        Theme set to {theme === "system" ? "system preference" : `${theme} mode`}
      </div>
    </div>
  );
}
