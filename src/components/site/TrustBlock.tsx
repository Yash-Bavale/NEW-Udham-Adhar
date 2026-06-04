import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, IdCard, Fingerprint, Share2, Download } from "lucide-react";
import { FAQS } from "@/lib/faqs-data";
import { IndiaMap } from "@/components/site/IndiaMap";

const HOME_FAQS = FAQS.slice(0, 10);

const PROCESS_STEPS = [
  { icon: IdCard, label: "Fill Form &\nMake Payment" },
  { icon: Fingerprint, label: "Submit Required\nInformation" },
  { icon: Share2, label: "Expert Assistance\n& Verification" },
  { icon: Download, label: "Updates Shared\nvia Email" },
];

export function TrustBlock() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {/* FAQ */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <header className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-brand-navy-deep">
              Frequently Asked Questions for MSME registration in India.
            </h2>
            <p className="mt-3 text-xs md:text-sm uppercase tracking-wider text-muted-foreground max-w-2xl mx-auto">
              MSME Business Help Services Online, SSI – Small Scale Industries Certificate – Update, Edit, and Download Acknowledgement
            </p>
          </header>

          <Accordion type="single" collapsible className="space-y-3">
            {HOME_FAQS.map((f, i) => (
              <AccordionItem
                key={f.id}
                value={`faq-${f.id}`}
                className="border border-border rounded-lg bg-card px-4 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-brand-navy-deep hover:no-underline">
                  {i + 1}. {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex justify-center">
            <Link to="/faqs">
              <Button className="bg-brand-navy hover:bg-brand-navy-deep text-white rounded-md px-6 h-11 gap-2">
                Read More <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>

      {/* Process */}
      <section className="bg-slate-100 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-brand-navy-deep mb-10">
            Udyam Assistance Process – Fast &amp; Simple
          </h2>
          <ol className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-2">
            {PROCESS_STEPS.map((s, idx) => (
              <li key={idx} className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                    <s.icon className="w-9 h-9 text-brand-navy-deep" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-brand-navy-deep whitespace-pre-line leading-tight">
                    {s.label}
                  </p>
                </div>
                {idx < PROCESS_STEPS.length - 1 && (
                  <ChevronRight className="hidden sm:block w-6 h-6 text-brand-navy-deep/60 shrink-0" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* India map */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-brand-navy-deep mb-8">
            We provide consultancy services across India.
          </h2>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <IndiaMap />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Serving entrepreneurs in every state and union territory of India.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
