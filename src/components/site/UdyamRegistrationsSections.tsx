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
  Globe2,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";

export const UDYAM_SERVICES_LIST = [
  {
    title: "Apply for New Udyam Registration",
    path: "/new-udyam-registration",
    icon: FileText,
    desc: "Complete assistance for new MSME & Udyam registration online.",
  },
  {
    title: "Apply for MSME Registration",
    path: "/new-udyam-registration",
    icon: Award,
    desc: "Official MSME registration consultancy & application support.",
  },
  {
    title: "Download Udyam Certificate",
    path: "/download-udyam-certificate",
    icon: Download,
    desc: "Fast & hassle-free retrieval of your Udyam Registration Certificate.",
  },
  {
    title: "Download MSME Certificate",
    path: "/download-udyam-certificate",
    icon: Download,
    desc: "Download & print your valid MSME certificate copy.",
  },
  {
    title: "Update Udyam Registration",
    path: "/update-udyam-certificate",
    icon: RefreshCw,
    desc: "Modify details, add enterprise activities or change contact info.",
  },
  {
    title: "Verify Udyam Registration",
    path: "/update-udyam-certificate",
    icon: Search,
    desc: "Check & verify Udyam Registration details & status online.",
  },
  {
    title: "Check Udyam Registration Status",
    path: "/update-udyam-certificate",
    icon: Search,
    desc: "Track application processing status with expert guidance.",
  },
  {
    title: "Forgot Udyam Registration Number",
    path: "/other-problem",
    icon: HelpCircle,
    desc: "Retrieve lost Udyam Registration Number (URN) with OTP assistance.",
  },
  {
    title: "Print Udyam Certificate",
    path: "/download-udyam-certificate",
    icon: Printer,
    desc: "Obtain high-quality printable copy of your Udyam Certificate.",
  },
  {
    title: "Udyam Registration Correction",
    path: "/update-udyam-certificate",
    icon: FileEdit,
    desc: "Correct business name, PAN, bank details or address in certificate.",
  },
  {
    title: "Udyam Aadhaar Assistance",
    path: "/new-udyam-registration",
    icon: ShieldCheck,
    desc: "Aadhaar verification & guidance for seamless Udyam registration.",
  },
  {
    title: "Udyog Aadhaar Migration",
    path: "/migrate-udyog-aadhaar-to-udyam",
    icon: RefreshCw,
    desc: "Migrate legacy Udyog Aadhaar Memorandum (UAM) to Udyam.",
  },
  {
    title: "MSME Certificate Assistance",
    path: "/new-udyam-registration",
    icon: Award,
    desc: "End-to-end guidance & support for all MSME business certificates.",
  },
];

export function UdyamRegistrationsSections() {
  return (
    <div className="space-y-0">
      {/* 1. Udyam Registration & MSME Assistance */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-y border-border/80 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/10 px-3.5 py-1 text-xs font-semibold text-brand-navy mb-3">
              <Building2 className="w-3.5 h-3.5" /> Udyam &amp; MSME Advisory
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight leading-snug">
              Udyam Registration Online | MSME Registration &amp; Certificate Assistance
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base md:text-lg mb-2 font-display">
                    Online Application &amp; Registration Guidance
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Apply for Udyam Registration Online with professional consultancy and assistance from Business Help Services. We help eligible businesses complete New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Forgot Udyam Registration Number, Udyam Aadhaar, Udyog Aadhaar Migration, Udyam Registration Correction, Print Udyam Certificate, MSME Certificate Download, Verify Udyam Registration, Udyam Registration Status, and other MSME-related services through a simple online process.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base md:text-lg mb-2 font-display">
                    Dedicated Support for Every Requirement
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Our registration services are designed for businesses looking for reliable support with Udyam and MSME-related requirements. Whether you want to apply for a new registration, update your existing registration, download your certificate, verify your registration, recover your registration number, or access any other Udyam-related service, our experienced team provides dedicated guidance throughout the process.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base md:text-lg mb-2 font-display">
                    Support for All Business Entity Types
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Business Help Services offers professional registration support for proprietorship firms, partnership firms, LLPs, Private Limited Companies, One Person Companies (OPCs), HUFs, trusts, societies, startups, manufacturers, traders, service providers, and other eligible business entities. Every application is handled with transparent communication, organised application support, and responsive customer service to help applicants complete their registration requirements smoothly and efficiently.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base md:text-lg mb-2 font-display">
                    Single Unified Registration Platform
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    From new registrations to certificate downloads, registration updates, status verification, corrections, and MSME-related services, Business Help Services provides a single platform where businesses can apply for multiple Udyam services through a secure and customer-friendly online process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Udyam & MSME Services */}
      <section className="bg-white py-12 md:py-16 border-b border-border/80">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-3.5 py-1 text-xs font-semibold text-brand-red mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Quick Online Services
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight">
              Apply for Udyam &amp; MSME Services Online
            </h2>
            <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Business Help Services provides professional registration support for a wide range of Udyam and MSME-related services. Choose the service you need and submit your application through our simple online process.
            </p>
          </div>

          {/* 13 Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {UDYAM_SERVICES_LIST.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <Link
                  key={idx}
                  to={srv.path}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-slate-50/50 p-5 hover:bg-white hover:border-brand-navy/40 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="inline-flex items-center text-xs font-semibold text-brand-navy group-hover:text-brand-red transition-colors">
                        Apply Now <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-base mb-1.5 font-display group-hover:text-brand-navy transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl bg-brand-navy/5 border border-brand-navy/15 p-5 md:p-6 text-center max-w-3xl mx-auto">
            <p className="text-sm md:text-base font-medium text-brand-navy leading-relaxed">
              Every service is supported by experienced registration professionals who help applicants complete their registration requirements through a transparent, organised, and customer-focused process.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Why Apply Through Business Help Services */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-border/80">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Why Choose Us
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight leading-snug">
              Professional Udyam Registration Services for Businesses Across India
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2 font-display">
                  Nationwide Online Support
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Business Help Services provides professional registration support for businesses seeking reliable assistance with Udyam Registration, MSME Registration, and certificate-related services. Our online registration support allows eligible businesses to apply for registrations, certificate downloads, registration updates, verification, corrections, and other Udyam-related services from anywhere in India.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2 font-display">
                  Dedicated &amp; Transparent Journey
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Every application receives dedicated customer support, transparent service, secure information handling, and timely updates throughout the registration journey. Whether you are applying for a new Udyam Registration, downloading your MSME Certificate, updating your registration, checking your registration status, or recovering your registration number, our team is committed to providing a simple and reliable registration experience.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2 font-display">
                  Trusted &amp; Organised Guidance
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Choose Business Help Services for trusted registration support, organised application handling, and professional guidance for all your Udyam Registration and MSME-related requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
