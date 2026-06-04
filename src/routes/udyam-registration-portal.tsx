import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Portal - Official MSME Registration Website" },
      { name: "description", content: "The Udyam registration portal is the official government website for MSME registration, providing a comprehensive, secure, and user-friendly platform for businesses to register, update information, and download certificates. Designed for micro, small, and medium enterprises, the portal simplifies the registration..." },
      { property: "og:title", content: "Udyam Registration Portal - Official MSME Registration Website" },
      { property: "og:description", content: "The Udyam registration portal is the official government website for MSME registration, providing a comprehensive, secure, and user-friendly platform for businesses to register, update information, and download certificates. Designed for micro, small, and medium enterprises, the portal simplifies the registration..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Portal" linkTitle="Udyam Registration Portal - Official MSME Registration Website" html={html} />,
});
