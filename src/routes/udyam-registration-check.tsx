import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Check | Verify MSME Status Online" },
      { name: "description", content: "Udyam Registration Check allows businesses to verify the status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar details,..." },
      { property: "og:title", content: "Udyam Registration Check | Verify MSME Status Online" },
      { property: "og:description", content: "Udyam Registration Check allows businesses to verify the status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar details,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration-check" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Check" linkTitle="Udyam Registration Check | Verify MSME Status Online" content={`Udyam Registration Check allows businesses to verify the status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar details, you can confirm whether your registration is active, pending, or requires updates. This verification ensures eligibility for bank loans, tenders, government subsidies, and other official schemes. The process is fast, secure, and completely digital, with step-by-step guidance provided for accurate results. Regularly checking Udyam Registration status ensures compliance, prevents disruptions in accessing benefits, and maintains business credibility. This service is essential for micro, small, and medium enterprises to stay officially recognized and operationally ready.`} html={html} />,
});
