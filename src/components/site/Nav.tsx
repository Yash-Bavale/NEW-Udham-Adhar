import { Link } from "@tanstack/react-router";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  return (
    <nav className="hidden md:block bg-nav-bg border-b border-border">
      <div className="mx-auto max-w-7xl px-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm font-medium text-brand-navy">
          {NAV_LINKS.map((l) => (
            <li key={`${l.to}-${l.label}`}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-brand-red font-semibold" }}
                className="hover:text-brand-red transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
