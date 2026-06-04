import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-portal.html?raw";

export const Route = createFileRoute("/msme-registration-portal")({
  head: () => ({
    meta: [
      { title: "MSME Registration Portal - Official Site for MSME Registration" },
      { name: "description", content: "The MSME registration portal is the official government website for registering micro, small, or medium enterprises in India. It provides a secure, paperless, and free registration process through Aadhaar-based verification. Entrepreneurs can complete the registration online, obtain a unique Udyam Registration..." },
      { property: "og:title", content: "MSME Registration Portal - Official Site for MSME Registration" },
      { property: "og:description", content: "The MSME registration portal is the official government website for registering micro, small, or medium enterprises in India. It provides a secure, paperless, and free registration process through Aadhaar-based verification. Entrepreneurs can complete the registration online, obtain a unique Udyam Registration..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration portal" linkTitle="MSME Registration Portal - Official Site for MSME Registration" html={html} />,
});
