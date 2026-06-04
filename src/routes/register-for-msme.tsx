import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-for-msme.html?raw";

export const Route = createFileRoute("/register-for-msme")({
  head: () => ({
    meta: [
      { title: "Register for MSME - Free Online Udyam Registration" },
      { name: "description", content: "Registering for MSME is now easier than ever thanks to the government’s fully digital and cost-free Udyam registration system, which enables businesses across India to obtain official MSME recognition without paperwork or lengthy formalities. The process is straightforward and requires only basic business details..." },
      { property: "og:title", content: "Register for MSME - Free Online Udyam Registration" },
      { property: "og:description", content: "Registering for MSME is now easier than ever thanks to the government’s fully digital and cost-free Udyam registration system, which enables businesses across India to obtain official MSME recognition without paperwork or lengthy formalities. The process is straightforward and requires only basic business details..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/register-for-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Register for MSME" linkTitle="Register for MSME - Free Online Udyam Registration" html={html} />,
});
