import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar Update provides businesses the option to modify or correct their UAN details online. Entrepreneurs can update essential business information, including name, address, activity, or ownership details, through Aadhaar-based OTP verification. Keeping your MSME profile accurate is crucial for accessing..." },
      { property: "og:title", content: "Udyog Aadhaar Update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar Update provides businesses the option to modify or correct their UAN details online. Entrepreneurs can update essential business information, including name, address, activity, or ownership details, through Aadhaar-based OTP verification. Keeping your MSME profile accurate is crucial for accessing..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Update" linkTitle="Udyog Aadhaar Update" html={html} />,
});
