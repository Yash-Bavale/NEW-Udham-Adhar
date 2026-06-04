import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/msme-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam Certificate Download - Instant Online Access" },
      { name: "description", content: "MSME Udyam certificate download allows businesses to instantly access their official MSME certificate online after completing Udyam registration. This digitally signed certificate confirms your enterprise as a registered Micro, Small, or Medium Enterprise and serves as legal proof of your MSME status. Having the..." },
      { property: "og:title", content: "MSME Udyam Certificate Download - Instant Online Access" },
      { property: "og:description", content: "MSME Udyam certificate download allows businesses to instantly access their official MSME certificate online after completing Udyam registration. This digitally signed certificate confirms your enterprise as a registered Micro, Small, or Medium Enterprise and serves as legal proof of your MSME status. Having the..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam certificate download" linkTitle="MSME Udyam Certificate Download - Instant Online Access" html={html} />,
});
