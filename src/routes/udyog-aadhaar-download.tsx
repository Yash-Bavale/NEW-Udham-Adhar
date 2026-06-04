import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar Download allows businesses to retrieve their old Udyog Aadhaar (UAN) certificate through the official portal using a registered mobile number. The certificate PDF can be printed or used to migrate your UAN to the new Udyam Registration system. This process is useful for businesses still transitioning..." },
      { property: "og:title", content: "Udyog Aadhaar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar Download allows businesses to retrieve their old Udyog Aadhaar (UAN) certificate through the official portal using a registered mobile number. The certificate PDF can be printed or used to migrate your UAN to the new Udyam Registration system. This process is useful for businesses still transitioning..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Download" linkTitle="Udyog Aadhaar Download" html={html} />,
});
