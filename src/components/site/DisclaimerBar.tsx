import { DISCLAIMER_TEXT } from "@/lib/constants";

export function DisclaimerBar() {
  return (
    <div className="overflow-hidden">
      {/* Prominent static disclaimer — fixes site impersonation classifier */}
      <div className="bg-amber-300 text-black border-y-2 border-amber-500">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-[12px] md:text-sm leading-snug font-medium text-center">
          <strong>Disclaimer:</strong> Business Help Services is a private
          registration consultancy. We are <strong>not affiliated with,
          endorsed by, or part of</strong> any government department or
          ministry. All fees collected are professional service charges only,
          not government fees. The official government portal for Udyam
          registration is{" "}
          <a
            href="https://udyamregistration.gov.in"
            rel="nofollow noopener external"
            target="_blank"
            className="underline font-semibold"
          >
            udyamregistration.gov.in
          </a>
          .
        </div>
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
