import { Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  FileText,
  Download,
  RefreshCw,
  Search,
  Award,
  ShieldCheck,
  ArrowUpRight,
  HelpCircle,
  Printer,
  FileEdit,
} from "lucide-react";

export const UDYAM_SERVICES_LIST = [
  {
    title: "New Udyam Registration",
    path: "/new-udyam-registration",
    icon: FileText,
  },
  {
    title: "MSME Registration",
    path: "/new-udyam-registration",
    icon: Award,
  },
  {
    title: "Udyam Certificate Download",
    path: "/download-udyam-certificate",
    icon: Download,
  },
  {
    title: "MSME Certificate Download",
    path: "/download-udyam-certificate",
    icon: Download,
  },
  {
    title: "Update Udyam Registration",
    path: "/update-udyam-certificate",
    icon: RefreshCw,
  },
  {
    title: "Verify Udyam Registration",
    path: "/update-udyam-certificate",
    icon: Search,
  },
  {
    title: "Check Udyam Registration Status",
    path: "/update-udyam-certificate",
    icon: Search,
  },
  {
    title: "Forgot Udyam Registration Number",
    path: "/other-problem",
    icon: HelpCircle,
  },
  {
    title: "Print Udyam Certificate",
    path: "/download-udyam-certificate",
    icon: Printer,
  },
  {
    title: "Udyam Registration Correction",
    path: "/update-udyam-certificate",
    icon: FileEdit,
  },
  {
    title: "Udyam Aadhaar",
    path: "/new-udyam-registration",
    icon: ShieldCheck,
  },
  {
    title: "Udyog Aadhaar Migration",
    path: "/migrate-udyog-aadhaar-to-udyam",
    icon: RefreshCw,
  },
];

export function UdyamRegistrationsSections() {
  return (
    <div className="space-y-0">
      {/* 1. Udyam Registration Online | MSME Registration & Certificate (Clean Paragraph Structure) */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-y border-border/80 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/10 px-3.5 py-1 text-xs font-semibold text-brand-navy mb-3">
              <Building2 className="w-3.5 h-3.5" /> Udyam &amp; MSME Assistance
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight leading-snug">
              Udyam Registration Online | MSME Registration &amp; Certificate
            </h2>
          </div>

          <article className="bg-white rounded-2xl border border-border/80 p-6 md:p-10 shadow-sm space-y-6">
            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              Apply for Udyam Registration Online through a simple online application process. Submit applications for New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Forgot Udyam Registration Number, Udyam Aadhaar, Udyog Aadhaar Migration, Udyam Registration Correction, Print Udyam Certificate, MSME Certificate Download, Verify Udyam Registration, Check Udyam Registration Status, and other MSME-related requirements from one place.
            </p>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              The online application process is designed for proprietorship firms, partnership firms, LLPs, Private Limited Companies, One Person Companies (OPCs), HUFs, trusts, societies, startups, manufacturers, traders, service providers, and other eligible business entities. Applications are reviewed carefully to minimise errors and ensure that the required details are submitted correctly.
            </p>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              Whether you are applying for a new registration, updating business information, downloading your certificate, printing another copy, verifying registration details, checking application status, or recovering your Udyam Registration Number, every service is available through a single online platform with a simple application process.
            </p>
          </article>
        </div>
      </section>

      {/* 2. Apply for Udyam & MSME Services */}
      <section className="bg-white py-12 md:py-16 border-b border-border/80">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-3.5 py-1 text-xs font-semibold text-brand-red mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Online Services
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight">
              Apply for Udyam &amp; MSME Services
            </h2>
            <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Choose the required service and submit your application online.
            </p>
          </div>

          {/* 12 Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {UDYAM_SERVICES_LIST.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <Link
                  key={idx}
                  to={srv.path}
                  className="group relative flex items-center justify-between rounded-xl border border-border/80 bg-slate-50/50 p-4 md:p-5 hover:bg-white hover:border-brand-navy/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base font-display group-hover:text-brand-navy transition-colors">
                      {srv.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl bg-brand-navy/5 border border-brand-navy/15 p-5 md:p-6 text-center max-w-3xl mx-auto">
            <p className="text-sm md:text-base font-medium text-brand-navy leading-relaxed">
              Each application follows a structured online process, making it easier to submit registration requests, certificate requests, updates, corrections, and other MSME-related applications through one platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
