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
        className="flex items-center gap-1 text-sm print-hidden"
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
      className="flex items-center gap-1 text-sm print-hidden"
      role="group"
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`px-2 py-2 min-h-[44px] flex items-center transition-opacity hover:opacity-100 ${
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
        className={`px-2 py-2 min-h-[44px] flex items-center transition-opacity hover:opacity-100 ${
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
        className={`px-2 py-2 min-h-[44px] flex items-center transition-opacity hover:opacity-100 ${
          theme === "system" ? "font-medium underline" : "opacity-70"
        }`}
        aria-pressed={theme === "system"}
      >
        Auto
      </button>
      <div className="sr-only" aria-live="polite">
        Theme set to{" "}
        {theme === "system" ? "system preference" : `${theme} mode`}
      </div>
    </div>
  );
}
