import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleTitleClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <>
      {/* Top thin bar */}
      <div className="bg-muted text-xs text-muted-foreground border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-2 flex justify-center md:justify-end bg-[#d2e3f3]">
          <span>Change Language</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 bg-slate-50">
          {/* Mobile */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={handleTitleClick}
              className="block w-full text-center bg-transparent p-0 cursor-pointer"
              aria-label="Go to homepage"
            >
              <h1 className="text-xl font-bold text-brand-red font-display leading-tight">
                सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सेवा
              </h1>
              <p className="text-xs tracking-wider text-brand-navy font-semibold font-display mt-1">
                REGISTRATION FOR MICRO, SMALL &amp; MEDIUM ENTERPRISES
              </p>
            </button>
            <div className="mt-5 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border-2 border-brand-navy text-brand-navy bg-transparent"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-3 items-center gap-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold text-brand-red leading-tight font-display">
                Udyam Registration
              </span>
              <span className="text-sm text-foreground/80">
                Business Help Consultancy Services
              </span>
            </Link>

            <button
              type="button"
              onClick={handleTitleClick}
              className="text-center bg-transparent p-0 cursor-pointer"
              aria-label="Go to homepage"
            >
              <h1 className="text-2xl font-bold text-brand-red font-display leading-tight border-2">
                सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सेवा
              </h1>
              <p className="text-xs tracking-wider text-brand-navy font-semibold mt-1">
                REGISTRATION FOR MICRO, SMALL &amp; MEDIUM ENTERPRISES
              </p>
            </button>

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

      {/* Mobile sidebar drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-brand-navy text-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-brand-navy px-5 py-4 border-b border-white/15 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-5 py-4">
              <ul className="space-y-1">
                {NAV_LINKS.map((l) => (
                  <li key={`${l.to}-${l.label}`}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: l.to === "/" }}
                      activeProps={{ className: "bg-white/10 text-brand-gold" }}
                      className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 hover:text-brand-gold transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
