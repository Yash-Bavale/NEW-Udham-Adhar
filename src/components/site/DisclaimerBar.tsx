import { DISCLAIMER_TEXT } from "@/lib/constants";

export function DisclaimerBar() {
  return (
    <div className="overflow-hidden">
      {/* Prominent static disclaimer — kept in DOM (sr-only) for crawlers / SEO */}
      <div className="sr-only" aria-hidden="false">
        <strong>Disclaimer:</strong> Business Help Services is a private
        registration consultancy. We are not affiliated with, endorsed by, or
        part of any government department or ministry. All fees collected are
        professional service charges only, not government fees. The official
        government portal for Udyam registration is udyamregistration.gov.in.
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
