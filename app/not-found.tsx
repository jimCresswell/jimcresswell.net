import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-foreground mb-4">Page not found</h1>
      <p className="font-serif text-base md:text-lg leading-prose text-foreground/80 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="font-sans text-base md:text-lg font-medium text-foreground underline hover:opacity-80 transition-opacity min-h-11 flex items-center"
      >
        Go back home
      </Link>
    </div>
  );
}
