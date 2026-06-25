import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, FileCheck2, Sparkles, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import { TrustBlock } from "@/components/site/TrustBlock";
import { CountdownCard, type CountdownStep } from "@/components/site/CountdownCard";

export const Route = createFileRoute("/processing/$leadCode")({
  head: () => ({
    meta: [
      { title: "Processing Your Application — Please Wait" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProcessingPage,
});

const TOTAL_SECONDS = 30;

const STEPS: readonly CountdownStep[] = [
  { at: 0,  icon: ShieldCheck,  label: "Securing your details",        sub: "Encrypting personal information" },
  { at: 8,  icon: FileCheck2,   label: "Validating application data",  sub: "Cross-checking required fields" },
  { at: 15, icon: Sparkles,     label: "Running compliance checks",    sub: "Aligning with MSME guidelines" },
  { at: 22, icon: CheckCircle2, label: "Finalising your application",  sub: "Almost done…" },
] as const;

function ProcessingPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    trackEvent("processing_viewed", {});
  }, []);

  useEffect(() => {
    if (elapsed >= TOTAL_SECONDS) {
      navigate({ to: "/apply/$leadCode/summary", params: { leadCode }, replace: true });
      return;
    }
    const t = setTimeout(() => setElapsed((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, leadCode, navigate]);

  return (
    <div>
      <CountdownCard
        totalSeconds={TOTAL_SECONDS}
        elapsed={elapsed}
        steps={STEPS}
        leadCode={leadCode}
      />
      <TrustBlock />
    </div>
  );
}
