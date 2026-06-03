import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-portal.html?raw";

export const Route = createFileRoute("/msme-registration-portal")({
    head: () => ({
    meta: [
      { title: "MSME Registration Portal - Official Site for MSME Regist..." },
      { name: "description", content: "Expert consultancy assistance for msme registration portal - official site for msme regist.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Registration Portal - Official Site for MSME Regist..." },
      { property: "og:description", content: "Expert consultancy assistance for msme registration portal - official site for msme regist.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Portal" linkTitle="MSME Registration Portal - Official Site for MSME Registration" html={html} />,
});
