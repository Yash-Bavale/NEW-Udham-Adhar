import { DISCLAIMER_TEXT } from "@/lib/constants";

export function DisclaimerBar() {
  return (
    <div className="bg-disclaimer-bg text-white overflow-hidden">
      <div className="marquee-track py-2 text-xs md:text-sm font-medium">
        <span className="px-12">{DISCLAIMER_TEXT}</span>
        <span className="px-12">{DISCLAIMER_TEXT}</span>
      </div>
    </div>
  );
}
