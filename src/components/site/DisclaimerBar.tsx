import { DISCLAIMER_TEXT } from "@/lib/constants";
import { useBrand } from "@/lib/websites/brand-context";

export function DisclaimerBar() {
  const brand = useBrand();
  return (
    <div className="overflow-hidden">
      {/* Prominent static disclaimer — kept in DOM (sr-only) for crawlers / SEO */}
      <div className="sr-only" aria-hidden="false">
        <strong>Disclaimer:</strong> {brand.legalFooterLine}
      </div>
      {/* Existing marquee strip retained */}
      <div className="bg-disclaimer-bg text-white">
        <div className="marquee-track py-2 text-xs md:text-sm font-medium bg-[#31547d]">
          <span className="px-12">{DISCLAIMER_TEXT}</span>
          <span className="px-12">{DISCLAIMER_TEXT}</span>
        </div>
      </div>
    </div>
  );
}
