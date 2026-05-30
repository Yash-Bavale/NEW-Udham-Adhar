import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <>
      {/* Top thin bar */}
      <div className="bg-muted text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex justify-end">
          <span>Change Language</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <Link to="/" className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-bold text-brand-red leading-tight font-display">
              Udyam Registration
            </span>
            <span className="text-sm text-foreground/80">
              Business Help Consultancy Services
            </span>
          </Link>

          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-foreground font-display leading-tight">
              सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सेवा
            </h1>
            <p className="text-[11px] md:text-xs tracking-wider text-muted-foreground mt-1">
              REGISTRATION FOR MICRO, SMALL &amp; MEDIUM ENTERPRISES
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-deep transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
