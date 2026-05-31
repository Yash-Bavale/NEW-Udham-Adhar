import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, ChevronDown, Home as HomeIcon } from "lucide-react";
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
    slug: "udyam-registration",
    match: (s) =>
      s === "udyam-registration" ||
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
    match: (s) => s === "udhayam-aadhar-download",
  },
  {
    key: "print-msme-udyam-certificate",
    label: "Print MSME Udyam Certificate",
    slug: "print-msme-udyam-certificate",
    match: (s) =>
      s.startsWith("print-msme") ||
      s.startsWith("print-udyam") ||
      s.startsWith("msme-print") ||
      s.startsWith("udyam-print"),
  },
  {
    key: "udyam-registration-online",
    label: "Udyam Registration Online",
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
  { to: "/complaint-grievance-policy", label: "Complaint & Grievance Policy" },
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
  const navigate = useNavigate();
  const loadSeoPages = useServerFn(listPublicSeoPages);
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<SeoPageRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const clickTimes = useRef<number[]>([]);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHomeTrigger = () => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((time) => now - time < 10000);

    if (clickTimes.current.length >= 3) {
      clickTimes.current = [];
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setOpen(true);
      return true;
    }

    return false;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isHomePage = window.location.pathname === "/";
    if (handleHomeTrigger()) return;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (isHomePage) return;

    clickTimer.current = setTimeout(() => {
      clickTimes.current = [];
      navigate({ to: "/" });
    }, 1200);
  };

  useEffect(() => {
    if (pages !== null || loading) return;
    setLoading(true);
    setLoadError(false);
    loadSeoPages()
      .then((data) => {
        setPages((data ?? []) as SeoPageRow[]);
      })
      .catch(() => {
        setLoadError(true);
        setPages([]);
      })
      .finally(() => setLoading(false));
  }, [loadSeoPages, loading, pages]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <footer className="bg-brand-navy-deep text-white mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-xl font-bold font-display">Udyam Registration</div>
          <div className="text-sm text-white/80 mt-1">Business Help Consultancy Services</div>
          <p className="text-xs text-white/70 mt-4 leading-relaxed">
            Business Help Services is a private consultancy and assistance service provider and is
            not affiliated with, authorized by, endorsed by, or associated with any government
            authority or department.
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleHomeClick}
              onPointerDown={(e) => {
                if (e.pointerType === "touch") handleHomeTrigger();
              }}
              className="text-sm text-white/85 hover:text-white hover:underline select-none bg-transparent p-0 cursor-pointer"
              aria-label="Home"
            >
              Home
            </button>
          </div>
        </div>



        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Policies</h4>
          <ul className="space-y-2 text-sm text-white/85">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Reach Us</h4>
          <p className="text-sm text-white/85 font-semibold">Business Help Services</p>
          <p className="text-sm text-white/85 mt-2">
            📧{" "}
            <a href="mailto:help@businesshelpservices.com" className="hover:underline">
              help@businesshelpservices.com
            </a>
          </p>
          <p className="text-sm text-white/85 mt-1">
            📞{" "}
            <a href="tel:+919767870331" className="hover:underline">
              +91-9767870331
            </a>
          </p>
          <p className="text-sm text-white/85 mt-1 leading-relaxed">
            📍 Koregaon Bk, Khed, Pune,
            <br />
            Maharashtra – 410505, India
          </p>
          <p className="text-sm text-white/70 mt-3">Hours: Mon – Sat, 10:00 AM – 7:00 PM IST</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Business Help Services. All rights reserved.
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/65 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="min-h-screen w-full max-w-xl bg-brand-navy text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-brand-navy px-6 py-4 border-b border-white/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold leading-tight">
                    MSME / Udyog Aadhaar
                  </h3>
                  <p className="text-sm text-white/75">
                    {pages ? `${pages.length} pages` : "Loading…"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/seo-admin"
                    className="text-sm font-semibold text-brand-gold hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-2xl leading-none px-2 py-1 text-white hover:text-brand-gold"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            <nav className="px-6 py-5" aria-label="Hidden SEO landing pages">
              <Link
                to="/"
                className="mb-4 flex items-center gap-3 text-lg font-semibold text-white hover:text-brand-gold"
                onClick={() => setOpen(false)}
              >
                <ChevronRight className="h-6 w-6 shrink-0 stroke-[3]" aria-hidden="true" />
                Home
              </Link>

              <div className="mb-3 flex items-center gap-3 text-xl font-bold text-brand-gold">
                <span className="text-2xl leading-none">⌄</span>
                Udyamregistration
              </div>

              {loading && <p className="py-3 text-sm text-white/75">Loading pages…</p>}
              {loadError && (
                <p className="py-3 text-sm text-white/75">
                  Could not load SEO pages. Please try again.
                </p>
              )}
              {!loading && !loadError && pages && pages.length === 0 && (
                <p className="py-3 text-sm text-white/75">No pages yet.</p>
              )}
              {!loadError && pages && pages.length > 0 && (
                <ul className="space-y-3 text-lg font-semibold leading-snug">
                  {pages.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/${p.slug}`}
                        className="flex items-start gap-3 text-white hover:text-brand-gold"
                        onClick={() => setOpen(false)}
                      >
                        <ChevronRight
                          className="mt-0.5 h-6 w-6 shrink-0 stroke-[3]"
                          aria-hidden="true"
                        />
                        <span>{p.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </div>
      )}
    </footer>
  );
}
