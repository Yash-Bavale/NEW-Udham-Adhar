import { type ReactNode } from "react";

/** Standard inner-page container with a title band matching the homepage cards. */
export function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-5">
          <h1 className="text-2xl md:text-3xl font-bold font-display">{title}</h1>
        </div>
        <div className="p-6 md:p-10 space-y-4 text-foreground/85 text-[15px] leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_a]:text-brand-navy [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_strong]:text-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}
