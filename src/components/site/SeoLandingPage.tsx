import { LeadForm } from "@/components/site/LeadForm";
import { FaqSection } from "@/components/site/FaqSection";

const proseClasses =
  "p-6 md:p-8 space-y-4 text-foreground/85 text-[15px] leading-relaxed " +
  "[&_h1]:font-display [&_h1]:text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:first:mt-0 " +
  "[&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:first:mt-0 " +
  "[&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 " +
  "[&_h4]:font-display [&_h4]:text-foreground [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-5 " +
  "[&_a]:text-brand-navy [&_a]:underline " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 " +
  "[&_img]:rounded-md [&_img]:border [&_img]:border-border [&_img]:my-3 [&_img]:max-w-full [&_img]:h-auto " +
  "[&_svg]:hidden " +
  "[&_p]:my-3 [&_strong]:text-foreground";

/**
 * Strip duplicate content from imported WordPress HTML.
 * The React layout already renders its own LeadForm + Sample Certificate card,
 * and the source HTML contains oversized inline SVG icons we don't want.
 */
function sanitize(html: string): string {
  let out = html;
  // Remove all inline <style> and <script> blocks
  out = out.replace(/<style\b[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  // Remove all inline <svg>...</svg> (huge whatsapp icons etc.)
  out = out.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");
  // Remove the duplicate "Sample Certificate" block (heading + lightbox anchor + caption)
  out = out.replace(
    /<h2[^>]*>\s*Sample Certificate\s*<\/h2>[\s\S]*?<\/a>\s*(?:<p[^>]*>[^<]*reference purposes only\.?[^<]*<\/p>)?/i,
    "",
  );
  // Remove the duplicate "Fill application" / form remnants near the top
  out = out.replace(/<h2[^>]*>\s*Fill application\s*<\/h2>/i, "");
  out = out.replace(/<p[^>]*role=["']status["'][^>]*>[\s\S]*?<\/p>/gi, "");
  out = out.replace(/<ul>\s*<\/ul>/gi, "");
  // Remove the "Click to Connect with Expert" leftover text label
  out = out.replace(/Click to Connect with Expert/gi, "");

  // Remove inline duplicate certificate images that some WP pages embed in
  // the body (we already render our own Sample Certificate card on the right).
  // Strip the <img> and any <a>/<figure> wrapper around it.
  const dupImagePattern =
    /(udyam-aadhar\.jpe?g|udyam-certificate-design|udyam-certificate\.(?:png|jpe?g|webp))/i;
  out = out.replace(
    /<a\b[^>]*>\s*<img\b[^>]*src="[^"]*"[^>]*>\s*<\/a>/gi,
    (m) => (dupImagePattern.test(m) ? "" : m),
  );
  out = out.replace(
    /<figure\b[^>]*>[\s\S]*?<\/figure>/gi,
    (m) => (dupImagePattern.test(m) ? "" : m),
  );
  out = out.replace(
    /<img\b[^>]*src="[^"]*"[^>]*>/gi,
    (m) => (dupImagePattern.test(m) ? "" : m),
  );

  // De-duplicate stacked top headings that repeat the page title.
  // WP source typically renders: <h2>title</h2> ... <h1>title</h1> ... <a href="/"><h1>descriptive</h1></a>
  // Keep only the middle bold <h1>; strip the leading <h2> and the home-linked descriptive <h1>.
  out = out.replace(/^\s*(?:<h2[^>]*>[\s\S]*?<\/h2>\s*)+/i, "");
  out = out.replace(
    /<a[^>]*href=["']\/?["'][^>]*>\s*<h1[\s\S]*?<\/h1\s*>\s*<\/a>/gi,
    "",
  );
  // Collapse any remaining run of identical consecutive headings to a single one.
  out = out.replace(
    /(<h([1-3])[^>]*>\s*([\s\S]*?)\s*<\/h\2>)(\s*<h\2[^>]*>\s*\3\s*<\/h\2>)+/gi,
    "$1",
  );
  return out;
}

/**
 * SEO landing page layout: lead form + page-named title on top, prose content below.
 * Form heading mirrors the page title so each landing page collects leads under its own brand.
 */
export function SeoLandingPage({ title, html }: { title: string; html: string }) {
  const cleanHtml = sanitize(html);
  return (
    <>
      {/* Visually hidden H1 retained for SEO; the visible blue title bar was removed per client request. */}
      <h1 className="sr-only">{title}</h1>

      <section className="mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start">
        <LeadForm title={title} />

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
              Note: Sample Business Help Services Certificate shown for reference purposes only.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className={proseClasses} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        </div>
      </section>

      <FaqSection />
    </>
  );
}
