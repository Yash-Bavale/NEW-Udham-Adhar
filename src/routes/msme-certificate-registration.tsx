import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-registration.html?raw";

export const Route = createFileRoute("/msme-certificate-registration")({
    head: () => ({
    meta: [
      { title: "MSME Certificate Registration - Steps to Register Your B..." },
      { name: "description", content: "Expert consultancy assistance for msme certificate registration - steps to register your b.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Certificate Registration - Steps to Register Your B..." },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate registration - steps to register your b.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Registration - Steps to Register Your Busin" html={html} />,
});
