export function PolicyContent({ html }: { html: string }) {
  return (
    <section className="border-t border-border bg-background">
      <div className="container max-w-4xl py-12 md:py-16">
        <div
          className="policy-content text-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:mb-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h4]:font-display [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_p]:mb-4 [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-muted-foreground [&_li]:mb-1 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
