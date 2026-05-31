import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-online-registration.html?raw";

export const Route = createFileRoute("/msme-online-registration")({
    head: () => ({
    meta: [
      { title: "MSME Online Registration - Easy Business Help Services P..." },
      { name: "description", content: "Expert consultancy assistance for msme online registration - easy udyam/msme p.... Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Online Registration - Easy Business Help Services P..." },
      { property: "og:description", content: "Expert consultancy assistance for msme online registration - easy udyam/msme p.... Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Online Registration - Easy Business Help Services Process" html={html} />,
});
