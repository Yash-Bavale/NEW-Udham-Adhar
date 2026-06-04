import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-online-registration.html?raw";

export const Route = createFileRoute("/msme-online-registration")({
  head: () => ({
    meta: [
      { title: "MSME Online Registration - Easy Udyam Registration Process" },
      { name: "description", content: "MSME online registration through the Udyam portal offers business owners a fast, reliable, and fully digital method to obtain official recognition as a Micro, Small, or Medium Enterprise in India. The registration system is entirely free and designed to reduce paperwork, simplify verification, and make registration..." },
      { property: "og:title", content: "MSME Online Registration - Easy Udyam Registration Process" },
      { property: "og:description", content: "MSME online registration through the Udyam portal offers business owners a fast, reliable, and fully digital method to obtain official recognition as a Micro, Small, or Medium Enterprise in India. The registration system is entirely free and designed to reduce paperwork, simplify verification, and make registration..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Online Registration" linkTitle="MSME Online Registration - Easy Udyam Registration Process" html={html} />,
});
