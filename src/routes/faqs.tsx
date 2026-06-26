import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserPlus,
  FileText,
  Download,
  RefreshCcw,
  ArrowRightLeft,
  BadgeIndianRupee,
  LifeBuoy,
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import {
  FAQS,
  FAQ_CATEGORIES,
  type FaqCategoryKey,
} from "@/lib/faqs-data";

const ICONS: Record<string, typeof UserPlus> = {
  UserPlus,
  FileText,
  Download,
  RefreshCcw,
  ArrowRightLeft,
  BadgeIndianRupee,
  LifeBuoy,
};

const PAGE_TITLE =
  "Udyam & MSME FAQs — 115 Answers to Common Questions";
const PAGE_DESC =
  "Detailed Udyam Registration, MSME Certificate and Udyog Aadhaar FAQs — registration, documents, download, print, updates, migration, fees and benefits. Updated answers for 2026.";
const CANONICAL = "https://udyamadhar.in/faqs";

export const Route = createFileRoute("/faqs")({
  head: () => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return {
      meta: [
        { title: PAGE_TITLE },
        { name: "description", content: PAGE_DESC },
        {
          name: "keywords",
          content:
            "Udyam FAQ, MSME registration FAQ, Udyog Aadhaar questions, Udyam certificate download, MSME certificate print, Udyam update, Udyam migration, Udyam fees, MSME benefits",
        },
        { property: "og:title", content: PAGE_TITLE },
        { property: "og:description", content: PAGE_DESC },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: PAGE_TITLE },
        { name: "twitter:description", content: PAGE_DESC },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema),
        },
      ],
    };
  },
  component: FaqsPage,
});

function FaqsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<FaqCategoryKey | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (activeCat !== "all" && f.category !== activeCat) return false;
      if (!q) return true;
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    });
  }, [query, activeCat]);

  const grouped = useMemo(() => {
    const map = new Map<FaqCategoryKey, typeof FAQS>();
    for (const f of filtered) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return map;
  }, [filtered]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: FAQS.length };
    for (const c of FAQ_CATEGORIES) {
      m[c.key] = FAQS.filter((f) => f.category === c.key).length;
    }
    return m;
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-navy-deep to-brand-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs md:text-sm font-medium tracking-wide uppercase ring-1 ring-white/20">
            <HelpCircle className="h-4 w-4" /> Knowledge Base
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold font-display leading-tight">
            Udyam, MSME &amp; Udyog Aadhaar — Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed">
            {FAQS.length} carefully written answers covering Udyam registration,
            MSME certificate download &amp; print, updates, Udyog Aadhaar migration,
            fees, eligibility and troubleshooting — all in one searchable place.
          </p>

          <div className="mt-8 mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 115 FAQs — try 'download', 'OTP', 'PAN'…"
                className="h-14 pl-12 pr-4 text-base bg-white text-foreground rounded-xl shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-brand-gold"
                aria-label="Search FAQs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="border-b border-border bg-card sticky top-0 z-20 backdrop-blur bg-card/90">
        <div className="mx-auto max-w-6xl px-4 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <CategoryChip
              active={activeCat === "all"}
              onClick={() => setActiveCat("all")}
              label="All"
              count={counts.all}
            />
            {FAQ_CATEGORIES.map((c) => {
              const Icon = ICONS[c.icon] ?? HelpCircle;
              return (
                <CategoryChip
                  key={c.key}
                  active={activeCat === c.key}
                  onClick={() => setActiveCat(c.key)}
                  label={c.title}
                  count={counts[c.key] ?? 0}
                  Icon={Icon}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold text-foreground">No results</p>
            <p className="mt-2 text-muted-foreground">
              Try a different keyword or browse a category above.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setActiveCat("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        )}

        {FAQ_CATEGORIES.map((cat) => {
          const items = grouped.get(cat.key);
          if (!items || items.length === 0) return null;
          const Icon = ICONS[cat.icon] ?? HelpCircle;
          return (
            <article
              key={cat.key}
              id={cat.key}
              className="scroll-mt-24 mb-10 md:mb-14"
            >
              <header className="flex items-start gap-4 mb-5">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                    {cat.title}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      ({items.length})
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
              </header>

              <Accordion type="multiple" className="space-y-3">
                {items.map((f) => (
                  <AccordionItem
                    key={f.id}
                    value={`q-${f.id}`}
                    className="border border-border rounded-lg px-4 bg-card data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="text-left text-[15px] md:text-base font-semibold font-display hover:no-underline">
                      <span>{f.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-[15px]">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </article>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-brand-navy/5 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            Still have questions?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Our consultancy team is happy to help with Udyam registration,
            certificate downloads, updates and Udyog Aadhaar migration.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-navy text-white hover:bg-brand-navy-deep">
              <Link to="/">Start Your Application</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </section>
    </>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  Icon?: typeof UserPlus;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
        active
          ? "bg-brand-navy text-white shadow"
          : "bg-muted text-foreground hover:bg-brand-navy/10"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
      <span
        className={`text-xs ${active ? "text-white/80" : "text-muted-foreground"}`}
      >
        {count}
      </span>
    </button>
  );
}
