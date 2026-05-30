import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


type SeoPageRow = { id: string; slug: string; label: string };

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
  { to: "/payment-notice-service-acknowledgment", label: "Payment Notice & Service Acknowledgment" },
  { to: "/important-notice", label: "Important Notice" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Footer() {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<SeoPageRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHomeClick = (e: React.MouseEvent) => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 600);
    if (clickCount.current >= 3) {
      e.preventDefault();
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!open || pages !== null) return;
    setLoading(true);
    supabase
      .from("seo_pages")
      .select("id, slug, label")
      .eq("enabled", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setPages((data ?? []) as SeoPageRow[]);
        setLoading(false);
      });
  }, [open, pages]);

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
          <div className="text-sm text-white/80 mt-1">
            Business Help Consultancy Services
          </div>
          <p className="text-xs text-white/70 mt-4 leading-relaxed">
            Business Help Services is a private consultancy and assistance
            service provider and is not affiliated with, authorized by,
            endorsed by, or associated with any government authority or
            department.
          </p>

          <div className="mt-5">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="text-sm text-white/85 hover:text-white hover:underline select-none"
              aria-label="Home"
            >
              Home
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
            Policies
          </h4>
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
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
            Reach Us
          </h4>
          <p className="text-sm text-white/85">
            Email:{" "}
            <a href="mailto:support@udyamadhar.in" className="hover:underline">
              support@udyamadhar.in
            </a>
          </p>
          <p className="text-sm text-white/85 mt-1">
            Hours: Mon – Sat, 10:00 AM – 7:00 PM IST
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Business Help Services. All rights reserved.
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white text-foreground rounded-xl shadow-2xl max-w-3xl w-full my-8 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div>
                <h3 className="font-semibold text-base">Hidden SEO Landing Pages</h3>
                <p className="text-xs text-muted-foreground">
                  {pages ? `${pages.length} pages` : "Loading…"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/seo-admin"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Manage
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm px-2 py-1 rounded hover:bg-muted"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              {loading && <p className="text-sm text-muted-foreground">Loading pages…</p>}
              {pages && pages.length === 0 && (
                <p className="text-sm text-muted-foreground">No pages yet.</p>
              )}
              {pages && pages.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  {pages.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/${p.slug}`}
                        className="text-foreground/80 hover:text-primary hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
