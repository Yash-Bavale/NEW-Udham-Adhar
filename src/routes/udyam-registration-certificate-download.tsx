import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download - Official MSME Proof" },
      { name: "description", content: "Udyam registration certificate download allows businesses registered on the official Udyam portal to instantly access their digitally verified MSME certificate, which serves as legal proof of their Micro, Small, or Medium Enterprise status. After completing the registration process using basic business details and..." },
      { property: "og:title", content: "Udyam Registration Certificate Download - Official MSME Proof" },
      { property: "og:description", content: "Udyam registration certificate download allows businesses registered on the official Udyam portal to instantly access their digitally verified MSME certificate, which serves as legal proof of their Micro, Small, or Medium Enterprise status. After completing the registration process using basic business details and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam registration certificate download" linkTitle="Udyam Registration Certificate Download - Official MSME Proof" html={html} />,
});
