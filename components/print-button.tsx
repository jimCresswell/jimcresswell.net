"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden font-sans text-base underline text-accent hover:opacity-80 transition-opacity min-h-[44px] py-2"
    >
      Print CV
    </button>
  );
}
