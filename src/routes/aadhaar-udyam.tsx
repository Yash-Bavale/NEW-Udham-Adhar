import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhaar-udyam.html?raw";

export const Route = createFileRoute("/aadhaar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification" },
      { name: "description", content: "Aadhaar Udyam is the process of linking an entrepreneur’s Aadhaar number with their MSME registration to facilitate secure, fast, and paperless verification. This Aadhaar-based system allows businesses to obtain a digitally signed MSME certificate instantly, confirming legal recognition as a micro, small, or medium..." },
      { property: "og:title", content: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification" },
      { property: "og:description", content: "Aadhaar Udyam is the process of linking an entrepreneur’s Aadhaar number with their MSME registration to facilitate secure, fast, and paperless verification. This Aadhaar-based system allows businesses to obtain a digitally signed MSME certificate instantly, confirming legal recognition as a micro, small, or medium..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhaar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhaar Udyam" linkTitle="Aadhaar Udyam - Aadhaar Based MSME Registration Verification" html={html} />,
});
