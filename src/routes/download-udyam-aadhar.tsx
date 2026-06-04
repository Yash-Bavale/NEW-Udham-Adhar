import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Download Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Downloading Udyam Aadhaar certificate allows entrepreneurs to access their official MSME registration document in PDF format through the Udyam portal. By entering the Udyam Number and completing OTP verification, businesses receive a digitally signed certificate that serves as legal proof of their micro, small, or..." },
      { property: "og:title", content: "Download Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Downloading Udyam Aadhaar certificate allows entrepreneurs to access their official MSME registration document in PDF format through the Udyam portal. By entering the Udyam Number and completing OTP verification, businesses receive a digitally signed certificate that serves as legal proof of their micro, small, or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Aadhar" linkTitle="Download Udyam Aadhar" html={html} />,
});
