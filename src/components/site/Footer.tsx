import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { listPublicSeoPages } from "@/lib/seo-pages.functions";

type SeoPageRow = { id: string; slug: string; label: string };

const FALLBACK_SEO_PAGES: SeoPageRow[] = [
  { id: "fallback-udyamregistration", slug: "udyamregistration", label: "Udyamregistration" },
  { id: "fallback-udyam-regn", slug: "udyam-regn", label: "Udyam Regn" },
  { id: "fallback-udyam", slug: "udyam", label: "Udyam" },
  { id: "fallback-udyog-aadhar", slug: "udyog-aadhar", label: "Udyog Aadhar" },
  { id: "fallback-udyam-certificate", slug: "udyam-certificate", label: "Udyam Certificate" },
  { id: "fallback-register-for-msme", slug: "register-for-msme", label: "Register For MSME" },
  { id: "fallback-register-msme", slug: "register-msme", label: "Register MSME" },
  { id: "fallback-udyam-aadhar", slug: "udyam-aadhar", label: "Udyam Aadhar" },
  {
    id: "fallback-udyam-reg-certificate",
    slug: "udyam-reg-certificate",
    label: "Udyam Reg Certificate",
  },
  {
    id: "fallback-udyam-regn-certificate",
    slug: "udyam-regn-certificate",
    label: "Udyam Regn Certificate",
  },
  {
    id: "fallback-udyamregistration-gov-in",
    slug: "udyamregistration-gov-in",
    label: "Udyamregistration Gov In",
  },
  {
    id: "fallback-aadhar-udyog-registration",
    slug: "aadhar-udyog-registration",
    label: "Aadhar Udyog Registration",
  },
  {
    id: "fallback-udyog-aadhar-certificate-download",
    slug: "udyog-aadhar-certificate-download",
    label: "Udyog Aadhar Certificate Download",
  },
  {
    id: "fallback-official-msme-registration-website",
    slug: "msme-registration-portal",
    label: "Official MSME Registration Website",
  },
  { id: "fallback-aadhaar-udyam", slug: "aadhaar-udyam", label: "Aadhaar Udyam" },
  {
    id: "fallback-msme-registration-process",
    slug: "msme-registration-process",
    label: "MSME Registration Process",
  },
  {
    id: "fallback-udyam-aadhaar-download-pdf",
    slug: "udyam-aadhaar-download-pdf",
    label: "Udyam Aadhaar Download PDF",
  },
  {
    id: "fallback-udyog-aadhar-registration",
    slug: "udyog-aadhar-registration",
    label: "Udyog Aadhar Registration",
  },
  {
    id: "fallback-udhayam-aadhar-download",
    slug: "udhayam-aadhar-download",
    label: "Udhayam Aadhar Download",
  },
  {
    id: "fallback-print-msme-udyam-certificate",
    slug: "print-msme-udyam-certificate",
    label: "Print MSME Udyam Certificate",
  },
  {
    id: "fallback-udyam-registration-online",
    slug: "udyam-registration-online",
    label: "Udyam Registration Online",
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
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Native detail counts rapid consecutive clicks
    const detail = (e as unknown as { detail: number }).detail;
    if (detail >= 3) {
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setOpen(true);
      return;
    }
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      const c = clickCount.current;
      clickCount.current = 0;
      if (c >= 3) {
        setOpen(true);
      } else {
        navigate({ to: "/" });
      }
    }, 350);
  };

  useEffect(() => {
    if (!open || pages !== null) return;
    setLoading(true);
    loadSeoPages()
      .then((data) => {
        const rows = (data ?? []) as SeoPageRow[];
        setPages(rows.length > 0 ? rows : FALLBACK_SEO_PAGES);
      })
      .catch(() => setPages(FALLBACK_SEO_PAGES))
      .finally(() => setLoading(false));
  }, [loadSeoPages, open, pages]);

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
          <p className="text-sm text-white/85">
            Email:{" "}
            <a href="mailto:support@udyamadhar.in" className="hover:underline">
              support@udyamadhar.in
            </a>
          </p>
          <p className="text-sm text-white/85 mt-1">Hours: Mon – Sat, 10:00 AM – 7:00 PM IST</p>
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
              {pages && pages.length > 0 && (
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
