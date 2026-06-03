import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-update.html?raw";

export const Route = createFileRoute("/msme-certificate-update")({
    head: () => ({
    meta: [
      { title: "MSME Certificate Update - How to Update Your MSME Regist..." },
      { name: "description", content: "Expert consultancy assistance for msme certificate update - how to update your msme regist.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Certificate Update - How to Update Your MSME Regist..." },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate update - how to update your msme regist.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Update - How to Update Your MSME Registration" html={html} />,
});
