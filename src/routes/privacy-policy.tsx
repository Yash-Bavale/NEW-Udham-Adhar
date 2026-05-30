import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Udyam Registration Consultancy" },
      { name: "description", content: "How Business Help Services collects, uses, stores and protects your personal information." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "Privacy practices for Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Privacy Policy">
      <p>
        We collect only the information necessary to provide consultancy
        assistance — applicant name, email, mobile, state, language preference,
        and selected service — along with documents you voluntarily share with
        us for processing.
      </p>
      <p className="text-sm text-muted-foreground">
        Full privacy policy content will be ported from udyamadhar.in/privacy-policy.
      </p>
    </PageHero>
  ),
});
