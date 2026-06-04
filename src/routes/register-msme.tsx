import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-msme.html?raw";

export const Route = createFileRoute("/register-msme")({
  head: () => ({
    meta: [
      { title: "Register MSME - Online Process for Business Registration" },
      { name: "description", content: "Register MSME online through the government’s official Udyam portal to obtain legitimate recognition as a micro, small, or medium enterprise in India. The online registration system is designed to be completely free, secure, and accessible to entrepreneurs from all sectors, ensuring that even small or emerging..." },
      { property: "og:title", content: "Register MSME - Online Process for Business Registration" },
      { property: "og:description", content: "Register MSME online through the government’s official Udyam portal to obtain legitimate recognition as a micro, small, or medium enterprise in India. The online registration system is designed to be completely free, secure, and accessible to entrepreneurs from all sectors, ensuring that even small or emerging..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/register-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Register MSME" linkTitle="Register MSME - Online Process for Business Registration" html={html} />,
});
