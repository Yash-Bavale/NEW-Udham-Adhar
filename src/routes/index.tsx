import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserSquare2, Fingerprint, Share2, Download, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business Help Services — Apply, Update, Download" },
      {
        name: "description",
        content:
          "Get expert consultancy for Udyam/MSME registration, certificate updates, downloads, and Udyog Aadhaar migration across India.",
      },
      { property: "og:title", content: "Business Help Services — Apply, Update, Download" },
      {
        property: "og:description",
        content:
          "Expert consultancy assistance for Udyam/MSME registration, certificate updates, downloads and migration.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/" },
    ],
  }),
  component: HomePage,
});

const FAQS = [
  {
    q: "1. What is Business Help Services?",
    a: "Business Help Services is an online registration process for Micro, Small, and Medium Enterprises (MSMEs) in India, subject to applicable eligibility criteria and regulations.",
  },
  {
    q: "2. Who can apply for Business Help Services?",
    a: "Eligible proprietors, startups, traders, service providers, manufacturers, partnerships, companies, and other business entities operating as MSMEs may apply subject to applicable rules and eligibility conditions.",
  },
  {
    q: "3. What is the use of Business Help Services for businesses?",
    a: "Business Help Services may help businesses maintain MSME registration records and may be used wherever applicable for business-related documentation, compliance, financial, operational, or institutional purposes subject to applicable policies and eligibility conditions.",
  },
  {
    q: "4. Can I update or modify my Business Help Services details?",
    a: "Subject to applicable rules and portal functionality, certain business details such as address, mobile number, email, business activity, or other information may be updated through the relevant process and verification requirements.",
  },
  {
    q: "5. What should I do if my registered mobile number or email is no longer accessible?",
    a: "Depending upon applicable procedures and verification requirements, users may request assistance for updating or recovering registered contact details wherever permitted.",
  },
  {
    q: "6. Can I download my Udyam Certificate online?",
    a: "Subject to applicable verification procedures and portal availability, Udyam-related certificates or acknowledgments may be downloaded or retrieved through the relevant process wherever available.",
  },
  {
    q: "7. What documents or information may be required for Udyam-related services?",
    a: "Depending upon the requested service, users may be required to provide details such as Aadhaar information, PAN information, business details, OTP verification, contact details, or other supporting information wherever applicable.",
  },
  {
    q: "8. Is OTP verification required for certain Udyam-related processes?",
    a: "Yes. Certain services or updates may require OTP verification, authentication confirmation, or consent-based validation depending upon the applicable process and system requirements.",
  },
  {
    q: "9. Can businesses update business activity or classification details in Udyam records?",
    a: "Subject to applicable procedures and verification requirements, certain business-related details including activity classification or related information may be updated wherever permitted.",
  },
  {
    q: "10. What happens if incorrect information is submitted during registration or update?",
    a: "Incorrect, incomplete, inconsistent, or unverifiable information may affect processing, verification, communication, eligibility assessment, or successful completion of the requested service.",
  },
];

const STEPS = [
  { icon: UserSquare2, label: "Fill Form & Make Payment", color: "text-brand-navy" },
  { icon: Fingerprint, label: "Submit Required Information", color: "text-brand-red" },
  { icon: Share2, label: "Expert Assistance & Verification", color: "text-brand-navy" },
  { icon: Download, label: "Updates Shared via Email", color: "text-green-600" },
];

const FACTS: [string, string][] = [
  ["Country", "India"],
  ["Area", "3,287,263 sq. km."],
  ["States", "28"],
  ["Population", "1,46,39,00,000"],
  ["Literacy", "80.9%"],
];

function HomePage() {
  return (
    <>
      {/* Form + Sample Certificate */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start">
        <LeadForm />

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-form-header text-white text-center py-4">
            <h2 className="text-xl font-bold font-display">Sample Certificate</h2>
          </div>
          <div className="p-6">
            <img
              src="https://www.udyamadhar.in/wp-content/uploads/2026/05/udyam-certificate-design-1.webp"
              alt="Sample Business Help Services Certificate"
              className="w-full h-auto rounded-md border border-border"
              loading="lazy"
            />
            <p className="mt-3 text-center text-sm text-muted-foreground text-slate-950">
              Sample Business Help Services Certificate shown for reference purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">
          Frequently Asked Questions for MSME registration in India.
        </h2>
        <p className="mt-4 text-center text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
          MSME Business Help Services Online, SSI – Small Scale Industries Certificate – Update, Edit, and Download Acknowledgement
        </p>

        <Accordion type="single" collapsible className="mt-8 md:mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold font-display hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Process Steps */}
      <section className="bg-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground">
            Udyam Assistance Process – Fast &amp; Simple
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4 items-start">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Icon className={`w-9 h-9 md:w-11 md:h-11 ${s.color}`} strokeWidth={2} />
                  </div>
                  <p className="mt-4 font-bold text-foreground text-sm md:text-base leading-snug max-w-[12ch]">
                    {s.label}
                  </p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden md:block absolute top-10 -right-3 w-6 h-6 text-foreground"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* India Coverage */}
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <div className="bg-muted/40 px-6 py-5 border-b border-border">
            <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground">
              We provide consultancy services across India.
            </h2>
          </div>
          <div className="p-4 md:p-6 flex justify-center">
            <img
              src="https://udyamadhar.in/wp-content/uploads/2025/11/India-map-en.svg.webp"
              alt="Map of India showing all states where consultancy services are provided"
              className="w-full max-w-xl h-auto"
              loading="lazy"
            />
          </div>
          <table className="w-full border-t border-border text-sm md:text-base">
            <tbody>
              {FACTS.map(([k, v]) => (
                <tr key={k} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="w-1/2 text-left font-normal text-foreground px-4 md:px-6 py-4 border-r border-border"
                  >
                    {k}
                  </th>
                  <td className="px-4 md:px-6 py-4 text-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
