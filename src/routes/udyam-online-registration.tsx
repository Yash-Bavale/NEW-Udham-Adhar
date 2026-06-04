import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-online-registration.html?raw";

export const Route = createFileRoute("/udyam-online-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Online Registration - Quick MSME Registration Process" },
      { name: "description", content: "Udyam online registration is the official government platform for digitally registering your business as a micro, small, or medium enterprise. The process is fully paperless, free, and requires only basic business information along with Aadhaar verification. Upon completion, businesses receive a unique Udyam..." },
      { property: "og:title", content: "Udyam Online Registration - Quick MSME Registration Process" },
      { property: "og:description", content: "Udyam online registration is the official government platform for digitally registering your business as a micro, small, or medium enterprise. The process is fully paperless, free, and requires only basic business information along with Aadhaar verification. Upon completion, businesses receive a unique Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam online registration" linkTitle="Udyam Online Registration - Quick MSME Registration Process" html={html} />,
});
