import { LOGO_BADGE_VIEWBOX, LOGO_LETTERS_PATH } from "@/lib/logo-path";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={LOGO_BADGE_VIEWBOX}
      className={className}
      aria-hidden="true"
    >
      <circle cx="256" cy="256" r="256" fill="currentColor" />
      <path d={LOGO_LETTERS_PATH} className="fill-background" />
    </svg>
  );
}
