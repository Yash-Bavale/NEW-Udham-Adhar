import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate.html?raw";

export const Route = createFileRoute("/udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate - Download Official MSME Certificate Online" },
      { name: "description", content: "The Udyam Certificate is the official and digitally authenticated proof of MSME registration issued by the Government of India upon successful completion of the Udyam registration process. This certificate serves as a fundamental document for micro, small, and medium enterprises seeking to access government-backed..." },
      { property: "og:title", content: "Udyam Certificate - Download Official MSME Certificate Online" },
      { property: "og:description", content: "The Udyam Certificate is the official and digitally authenticated proof of MSME registration issued by the Government of India upon successful completion of the Udyam registration process. This certificate serves as a fundamental document for micro, small, and medium enterprises seeking to access government-backed..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate" linkTitle="Udyam Certificate - Download Official MSME Certificate Online" html={html} />,
});
