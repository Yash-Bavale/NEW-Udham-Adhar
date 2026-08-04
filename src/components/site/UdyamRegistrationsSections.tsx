import { Link } from "@tanstack/react-router";
import {
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
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6">
      {/* 1. Udyam Registration & MSME Registration Services */}
      <section className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3">
          Udyam Registration &amp; MSME Registration Services
        </h2>
        <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
          <p>
            Apply for Udyam Registration Online through a simple online application designed for eligible Micro, Small, and Medium Enterprises (MSMEs). Whether you are registering a new business, updating your existing Udyam Registration, downloading your Udyam Certificate, recovering your Udyam Registration Number, or managing any other Udyam-related requirement, you can access multiple registration services from one platform.
          </p>
          <p>
            Our platform supports a wide range of Udyam and MSME-related applications, including New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Print Udyam Certificate, Forgot Udyam Registration Number, Verify Udyam Registration, Check Udyam Registration Status, Udyam Registration Correction, Udyam Aadhaar, Udyog Aadhaar Migration, and other registration-related services.
          </p>
          <p>
            Instead of searching different websites for different requirements, submit your application through one platform designed to simplify multiple Udyam and MSME registration services. Whether your business is newly established or already registered under the MSME framework, you can choose the required service, complete the online application, and manage different registration requirements from one place.
          </p>
        </div>
      </section>

      {/* 2. Apply for Multiple Udyam Services Online */}
      <section className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3">
          Apply for Multiple Udyam Services Online
        </h2>
        <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed mb-6">
          <p>
            Business registration requirements change as enterprises grow. A newly established business may need a New Udyam Registration, while an existing enterprise may require a certificate download, registration update, registration correction, verification, or another copy of the Udyam Certificate. Managing these requirements separately can be time-consuming, which is why multiple Udyam-related services are available through one online platform.
          </p>
          <p>
            Applications can be submitted for MSME Registration, Udyam Registration, Certificate Download, Certificate Printing, Registration Update, Registration Verification, Registration Status, Forgot Udyam Registration Number, Udyam Aadhaar, Udyog Aadhaar Migration, and other registration-related services.
          </p>
          <p>
            Whether you need a single service or multiple services over time, every application follows a structured online process designed to make submission easier while keeping all major Udyam requirements available in one place.
          </p>
        </div>

        {/* 12 Interactive Services Grid (Full Width 4-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
          {UDYAM_SERVICES_LIST.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <Link
                key={idx}
                to={srv.path}
                className="group flex items-center justify-between rounded-lg border border-border bg-slate-50/70 p-3.5 hover:bg-white hover:border-brand-navy/50 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm font-display group-hover:text-brand-navy transition-colors truncate">
                    {srv.title}
                  </h3>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors shrink-0 ml-1.5" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. One Platform for Udyam Registration Requirements */}
      <section className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3">
          One Platform for Udyam Registration Requirements
        </h2>
        <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
          <p>
            Different businesses require different Udyam-related services depending on their stage of growth. Some applicants are applying for their first Udyam Registration, while others need to update business information, download their Udyam Certificate, print another copy, verify registration details, recover their registration number, or check their application status.
          </p>
          <p>
            This platform brings together the most commonly used Udyam and MSME registration services, allowing applicants to complete different registration requirements without visiting multiple portals. From fresh registrations to updates, certificate services, corrections, verification, and registration status, every service is organised to provide a simple online application experience.
          </p>
          <p>
            Choose the required service, submit your application, and continue your registration journey through one platform designed to support multiple Udyam and MSME-related requirements.
          </p>
        </div>
      </section>

      {/* 4. Start Your Udyam Registration Online Today */}
      <section className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3">
          Start Your Udyam Registration Online Today
        </h2>
        <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
          <p>
            Begin your Udyam Registration Online by selecting the service that matches your requirement. Whether you are applying for New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Print Udyam Certificate, Forgot Udyam Registration Number, Registration Verification, Registration Status, Udyam Aadhaar, Udyog Aadhaar Migration, or Udyam Registration Correction, you can complete your application through one simple online process.
          </p>
          <p>
            The platform is designed to support multiple registration requirements for eligible business entities, making it easier to submit applications, manage existing registrations, and access Udyam-related services whenever required. Complete your application today and choose the service that best matches your business requirement.
          </p>
        </div>
      </section>
    </div>
  );
}
