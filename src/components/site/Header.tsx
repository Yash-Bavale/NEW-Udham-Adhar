import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <>
      {/* Top thin bar */}
      <div className="bg-muted text-xs text-muted-foreground border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-2 flex justify-center md:justify-end">
          <span>Change Language</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5">
          {/* Mobile: centered title with hamburger row below */}
          <div className="md:hidden">
            <div className="text-center">
              <h1 className="text-xl font-bold text-brand-red font-display leading-tight">
                सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सेवा
              </h1>
              <p className="text-xs tracking-wider text-brand-navy font-semibold font-display mt-1">
                REGISTRATION FOR MICRO, SMALL &amp; MEDIUM ENTERPRISES
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border flex justify-end">
              <Link
                to="/contact"
                aria-label="Menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border-2 border-brand-navy text-brand-navy"
              >
                <Menu className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden md:grid grid-cols-3 items-center gap-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold text-brand-red leading-tight font-display">
                Udyam Registration
              </span>
              <span className="text-sm text-foreground/80">
                Business Help Consultancy Services
              </span>
            </Link>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-brand-red font-display leading-tight">
                सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सेवा
              </h1>
              <p className="text-xs tracking-wider text-brand-navy font-semibold mt-1">
                REGISTRATION FOR MICRO, SMALL &amp; MEDIUM ENTERPRISES
              </p>
            </div>

            <div className="flex justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-deep transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
