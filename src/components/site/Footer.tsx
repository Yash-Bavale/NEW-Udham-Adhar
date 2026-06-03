import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Home as HomeIcon,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { listPublicSeoPages } from "@/lib/seo-pages.functions";


type SeoPageRow = { id: string; slug: string; label: string };

type Category = {
  key: string;
  label: string;
  slug: string | null; // null = Home
  match?: (slug: string, label: string) => boolean;
};

// Priority-ordered. Each page gets bucketed into the first matching category.
const CATEGORIES: Category[] = [
  { key: "home", label: "Home", slug: null },
  {
    key: "udyamregistration",
    label: "Udyamregistration",
    slug: "udyam-registration-online",
    match: (s) =>
      s === "udyam-registration-online" ||
      s.startsWith("udyam-registr") ||
      s.startsWith("udyamregistration"),
  },
  {
    key: "udyam-reg-certificate",
    label: "Udyam Regn Certificate",
    slug: "udyam-reg-certificate",
    match: (s) =>
      s === "udyam-reg-certificate" ||
      s.startsWith("udyam-certificate") ||
      s === "udyam-cer" ||
      s === "udyam-card" ||
      s === "udyam-number",
  },
  {
    key: "udyamregistration-gov-in",
    label: "Udyamregistration gov in",
    slug: "https-udyamregistration-gov-in",
    match: (s) => s.includes("udyamregistration-gov-in") || s === "udyam-portal",
  },
  {
    key: "aadhar-udyog-registration",
    label: "Aadhar Udyog registration",
    slug: "aadhar-udyog-registration",
    match: (s) => s.startsWith("aadhar-udyog") || s.startsWith("udhar-aadhar"),
  },
  {
    key: "udyog-aadhar-certificate-download",
    label: "Udyog Aadhar certificate download",
    slug: "msme-udyog-aadhar",
    match: (s) => s.startsWith("udyog-aadhar") || s === "msme-udyog-aadhar",
  },
  {
    key: "official-msme-registration-website",
    label: "Official MSME Registration Website",
    slug: "msme-registration-portal",
    match: (s) =>
      s === "msme-registration-portal" ||
      s === "msme-online-registration" ||
      s === "msme-apply-online" ||
      s === "register-msme" ||
      s === "register-for-msme" ||
      s === "msme-registration-login",
  },
  {
    key: "aadhaar-udyam",
    label: "Aadhaar Udyam",
    slug: "aadhaar-udyam",
    match: (s) =>
      s === "aadhaar-udyam" ||
      s.startsWith("aadhar-udyam") ||
      s.startsWith("udyam-aadhaar") ||
      s.startsWith("udyam-aadhar") ||
      s.startsWith("udyam-adhaar") ||
      s.startsWith("udyam-adhar"),
  },
  {
    key: "msme-registration-process",
    label: "MSME Registration Process",
    slug: "msme-registration-process",
    match: (s) =>
      s === "msme-registration-process" ||
      s.startsWith("msme-registration-") ||
      s.startsWith("msme-certificate") ||
      s === "ms-me-certificate" ||
      s === "msme-cer" ||
      s === "msme-updation",
  },
  {
    key: "udyam-aadhaar-download-pdf",
    label: "Udyam Aadhaar Download PDF",
    slug: "udyam-aadhaar-download-pdf",
    match: (s) =>
      s === "udyam-aadhaar-download-pdf" ||
      s.startsWith("udyam-download") ||
      s.startsWith("download-udyam") ||
      s === "download-msme-certificate" ||
      s === "free-msme-registration-certificate-download" ||
      s === "udham-aadhar-download" ||
      s === "udyam-card-download",
  },
  {
    key: "udyog-aadhar-registration",
    label: "Udyog Aadhar Registration",
    slug: "udyog-aadhar-registration",
    match: (s) => s === "udyog-aadhar-registration",
  },
  {
    key: "udhayam-aadhar-download",
    label: "Udhayam Aadhar Download",
    slug: "udhayam-aadhar-download",
    match: (s) =>
      ["udhayam-aadhar-download","udyam-print","print-udyam","udyam-register-print","udyam-print-download","udyam-reprint","udyam-print-certificate","msme-print-udyam-certificate","aadhar-udyam-print","msme-print-certificate"].includes(s),
  },
  {
    key: "print-msme-udyam-certificate",
    label: "Print MSME Udyam Certificate",
    slug: "print-msme-udyam-certificate",
    match: (s) =>
      ["print-msme-udyam-certificate","print-udyam-certificate-download","udyam-print-with-annexure","udyam-adhar-download","udyog-aadhaar-download","udyam-aadhaar-verify","udyam-aadhaar-status","udyam-registration-number-verify","udyam-pan-registration","udyam-aadhaar-login","print-udyam-certificate"].includes(s),
  },

  {
    key: "udyam-registration-online",
    label: "Business Help Services Online",
    slug: "udyam-online-registration",
    match: (s) =>
      s === "udyam-online-registration" ||
      s === "udyam-new-registration" ||
      s === "udyam-application" ||
      s === "udyam-apply" ||
      s === "udyam-pan-registration" ||
      s === "udyam-msme-registration" ||
      s.startsWith("udyam-register") ||
      s.startsWith("udyam-msme") ||
      s === "udyam" ||
      s === "udyam-edit",
  },
];

const FOOTER_LINKS = [
  { to: "/terms-conditions", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/refund-cancellation-policy", label: "Refund & Cancellation Policy" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/pricing-transparency", label: "Pricing Transparency" },
  { to: "/service-delivery-policy", label: "Service Delivery Policy" },
  { to: "/consent-acknowledgment", label: "Consent & Acknowledgment" },
  
  { to: "/compliance-statement", label: "Compliance Statement" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/aml-anti-fraud-policy", label: "AML / Anti-Fraud Policy" },
  {
    to: "/payment-notice-service-acknowledgment",
    label: "Payment Notice & Service Acknowledgment",
  },
  { to: "/important-notice", label: "Important Notice" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Footer() {
  const loadSeoPages = useServerFn(listPublicSeoPages);
  const [pages, setPages] = useState<SeoPageRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (pages !== null || loading) return;
    setLoading(true);
    setLoadError(false);
    loadSeoPages()
      .then((data) => setPages((data ?? []) as SeoPageRow[]))
      .catch(() => {
        setLoadError(true);
        setPages([]);
      })
      .finally(() => setLoading(false));
  }, [loadSeoPages, loading, pages]);

  return (
    <footer className="bg-brand-navy-deep text-white mt-12">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand + socials */}
        <div>
          <h3 className="text-2xl font-bold font-display leading-tight">
            © Business Help Services
          </h3>
        </div>

        {/* Col 2: MSME / Udyog Aadhaar — full SEO tree inline (client review mode) */}
        <div>
          <h4 className="text-2xl font-bold font-display leading-tight">
            MSME / Udyog Aadhaar
          </h4>
          <SeoTree pages={pages} loading={loading} loadError={loadError} />
        </div>

        {/* Col 3: Useful Links */}
        <div>
          <h4 className="text-2xl font-bold font-display leading-tight">
            Useful Links
          </h4>
          <ul className="mt-6 space-y-2.5 text-[15px] text-white/90">
            {FOOTER_LINKS.filter((l) => l.to !== "/contact" && l.to !== "/important-notice").map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Get in touch */}
        <div>
          <h4 className="text-2xl font-bold font-display leading-tight">
            Get in touch
          </h4>
          <ul className="mt-6 space-y-5 text-[15px] text-white/90">
            <li className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 mt-0.5 shrink-0 text-white/80" />
              <span>Working Hours: 10:00 AM to 05:00 PM (IST) ( Sunday & Public Holidays Off)</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 shrink-0 text-white/80" />
              <span>
                Email:<br />
                <a href="mailto:help@businesshelpservices.com" className="hover:underline break-all">
                  help@businesshelpservices.com
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-0.5 shrink-0 text-white/80" />
              <span>
                Phone:{" "}
                <a href="tel:+919767870331" className="hover:underline">+91-9767870331</a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-white/80" />
              <span>Address: Business Help Services Koregaon Bk, Taluka-Khed, Pune, Maharashtra – 410505, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm font-semibold text-white/85">
          Operated by Business Help Services
        </div>
      </div>
    </footer>
  );
}

function SeoTree({
  pages,
  loading,
  loadError,
}: {
  pages: SeoPageRow[] | null;
  loading: boolean;
  loadError: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map = new Map<string, SeoPageRow[]>();
    CATEGORIES.forEach((c) => map.set(c.key, []));
    if (!pages) return map;
    const mainSlugs = new Set(
      CATEGORIES.map((c) => c.slug).filter((s): s is string => !!s),
    );
    for (const p of pages) {
      if (mainSlugs.has(p.slug)) continue;
      const cat = CATEGORIES.find((c) => c.match?.(p.slug, p.label));
      if (cat) map.get(cat.key)!.push(p);
    }
    return map;
  }, [pages]);

  const toggle = (key: string) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  return (
    <nav className="mt-6" aria-label="SEO landing pages">
      {loading && <p className="py-2 text-sm text-white/75">Loading pages…</p>}
      {loadError && (
        <p className="py-2 text-sm text-white/75">Could not load SEO pages.</p>
      )}
      {!loading && (
        <ul className="space-y-1 text-[15px] font-semibold leading-snug">
          {CATEGORIES.map((cat) => {
            const children = grouped.get(cat.key) ?? [];
            const isOpen = expanded[cat.key];
            const hasChildren = children.length > 0;
            return (
              <li key={cat.key}>
                <div className="flex items-center gap-1">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggle(cat.key)}
                      className="p-1 text-white/85 hover:text-brand-gold"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 stroke-[3]" />
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center text-white/40">
                      {cat.slug === null ? (
                        <HomeIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                  {cat.slug === null ? (
                    <Link to="/" className="flex-1 py-1.5 text-white hover:text-brand-gold">
                      {cat.label}
                    </Link>
                  ) : (
                    <a href={`/${cat.slug}`} className="flex-1 py-1.5 text-white hover:text-brand-gold">
                      {cat.label}
                    </a>
                  )}
                </div>
                {hasChildren && isOpen && (
                  <ul className="ml-6 mt-1 mb-2 space-y-1 border-l border-white/15 pl-3 text-sm font-normal">
                    {children.map((p) => (
                      <li key={p.id}>
                        <a
                          href={`/${p.slug}`}
                          className="flex items-start gap-2 py-1 text-white/85 hover:text-brand-gold"
                        >
                          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{p.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
