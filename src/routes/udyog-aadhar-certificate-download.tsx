import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate Download - Get Your Old MSME Document" },
      { name: "description", content: "Udyog Aadhar certificate download enables businesses that were registered under the older Udyog Aadhaar system to access and retrieve their official certificate online. This certificate acted as proof of MSME status, allowing enterprises to benefit from government schemes, loans, subsidies, and participation in..." },
      { property: "og:title", content: "Udyog Aadhar Certificate Download - Get Your Old MSME Document" },
      { property: "og:description", content: "Udyog Aadhar certificate download enables businesses that were registered under the older Udyog Aadhaar system to access and retrieve their official certificate online. This certificate acted as proof of MSME status, allowing enterprises to benefit from government schemes, loans, subsidies, and participation in..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar certificate download" linkTitle="Udyog Aadhar Certificate Download - Get Your Old MSME Document" html={html} />,
});
