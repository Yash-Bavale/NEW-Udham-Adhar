import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyog-aadhar.html?raw";

export const Route = createFileRoute("/msme-udyog-aadhar")({
  head: () => ({
    meta: [
      { title: "MSME Udyog Aadhar - Old MSME Registration Identification" },
      { name: "description", content: "MSME Udyog Aadhar was the official identification system for small and medium enterprises registered under the older MSME scheme. It provided businesses with a unique Udyog Aadhaar Number (UAN) to access government benefits such as interest-free or collateral-free loans, tax subsidies, and participation in..." },
      { property: "og:title", content: "MSME Udyog Aadhar - Old MSME Registration Identification" },
      { property: "og:description", content: "MSME Udyog Aadhar was the official identification system for small and medium enterprises registered under the older MSME scheme. It provided businesses with a unique Udyog Aadhaar Number (UAN) to access government benefits such as interest-free or collateral-free loans, tax subsidies, and participation in..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyog-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyog Aadhar" linkTitle="MSME Udyog Aadhar - Old MSME Registration Identification" html={html} />,
});
