import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-edit.html?raw";

export const Route = createFileRoute("/udyam-edit")({
  head: () => ({
    meta: [
      { title: "Udyam Edit — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Edit your Udyam Registration details online quickly.
Udyam Edit allows businesses to update or modify their MSME registration details online quickly and securely. Entrepreneurs can edit business name, address, activity type, Aadhaar information, NIC codes, or business category as needed. The process uses OTP..." },
      { property: "og:title", content: "Udyam Edit — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Edit your Udyam Registration details online quickly.
Udyam Edit allows businesses to update or modify their MSME registration details online quickly and securely. Entrepreneurs can edit business name, address, activity type, Aadhaar information, NIC codes, or business category as needed. The process uses OTP..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-edit" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Edit" linkTitle="Udyam Edit" html={html} />,
});
