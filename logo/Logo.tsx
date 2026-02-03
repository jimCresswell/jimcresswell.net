"use client";

/**
 * Theme-aware logo component
 *
 * Uses next-themes to display the appropriate logo variant.
 * Falls back to system preference during SSR/hydration.
 *
 * Usage:
 *   <Logo className="h-8 w-8" />
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  /** Size in pixels (default: 32) */
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - only render theme-specific content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and hydration, show nothing or a placeholder
  // This prevents flash of wrong theme
  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  const src = resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg";

  return (
    <img
      src={src}
      alt="JC"
      width={size}
      height={size}
      className={className}
    />
  );
}
