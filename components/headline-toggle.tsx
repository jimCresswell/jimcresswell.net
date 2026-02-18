"use client";

import { useCallback, useRef, useState } from "react";

interface HeadlineToggleProps {
  /** Default headline — always shown in print. */
  primary: string;
  /** Alternate headline revealed on click. */
  alt: string;
}

/**
 * Clickable headline that toggles between two options with a fade transition.
 * Print always renders the primary headline regardless of toggle state.
 *
 * Uses `onTransitionEnd` rather than `setTimeout` so the text swap
 * waits for the CSS fade-out to genuinely complete — the duration and
 * easing can be tuned freely without breaking the swap timing.
 */
export function HeadlineToggle({ primary, alt }: HeadlineToggleProps) {
  const [showAlt, setShowAlt] = useState(false);
  const [visible, setVisible] = useState(true);
  const pendingSwap = useRef(false);

  const toggle = useCallback(() => {
    if (pendingSwap.current) return;
    pendingSwap.current = true;
    setVisible(false);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (!pendingSwap.current) return;
    pendingSwap.current = false;
    setShowAlt((prev) => !prev);
    requestAnimationFrame(() => {
      setVisible(true);
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <p className="font-sans text-sm md:text-base uppercase tracking-[0.08em] text-accent">
      {/* Interactive toggle for screen */}
      <span
        className="print:hidden cursor-pointer select-none"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Headline: ${showAlt ? alt : primary}. Click to toggle.`}
      >
        <span
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 800ms cubic-bezier(0.37, 0, 0.63, 1)",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {showAlt ? alt : primary}
        </span>
      </span>
      {/* Static primary for print — always visible regardless of toggle state */}
      <span className="hidden print:inline">{primary}</span>
    </p>
  );
}
