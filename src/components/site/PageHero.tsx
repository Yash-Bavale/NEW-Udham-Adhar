import { type ReactNode } from "react";

/** Standard inner-page container with a title band matching the homepage cards. */
export function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-5">
          <h1 className="text-2xl md:text-3xl font-bold font-display">{title}</h1>
        </div>
        <div className="p-6 md:p-10 prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/85 prose-a:text-brand-navy">
          {children}
        </div>
      </div>
    </section>
  );
}
