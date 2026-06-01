import { useState } from "react";
import { udyamFaqs, type Faq } from "@/lib/faqs";

const VISIBLE_COUNT = 4;

function FaqItem({ faq }: { faq: Faq }) {
  return (
    <details className="group rounded-lg border border-border bg-card transition-colors hover:border-brand-navy/40 open:border-brand-navy/60">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 md:p-5">
        <h3 className="font-display text-base md:text-lg font-semibold text-foreground">
          {faq.question}
        </h3>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-brand-navy transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="px-4 md:px-5 pb-5 pt-0 text-[15px] leading-relaxed text-foreground/85">
        {faq.answer}
      </div>
    </details>
  );
}

export function FaqSection({ faqs = udyamFaqs }: { faqs?: Faq[] }) {
  const [expanded, setExpanded] = useState(false);
  const initial = faqs.slice(0, VISIBLE_COUNT);
  const rest = faqs.slice(VISIBLE_COUNT);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-5xl px-4 pb-12"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-4">
          <h2 id="faq-heading" className="text-xl font-bold font-display">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="p-5 md:p-6 space-y-3">
          {initial.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}

          <div hidden={!expanded} className="space-y-3">
            {rest.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </div>

          {rest.length > 0 && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="faq-extra"
                className="inline-flex items-center gap-2 rounded-md border border-brand-navy bg-brand-navy px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy/90"
              >
                {expanded
                  ? "View Less"
                  : `View More Questions (${rest.length})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
