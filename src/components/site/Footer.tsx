import { Link } from "@tanstack/react-router";

const FOOTER_LINKS = [
  { to: "/terms-conditions", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/refund-cancellation-policy", label: "Refund & Cancellation Policy" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/pricing-transparency", label: "Pricing Transparency" },
  { to: "/consent-acknowledgment", label: "Consents & Acknowledgements" },
  { to: "/complaint-grievance-policy", label: "Complaint & Grievance Policy" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Footer() {
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
    </footer>
  );
}
