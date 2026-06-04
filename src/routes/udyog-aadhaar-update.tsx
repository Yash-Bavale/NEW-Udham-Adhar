import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Update – Modify UAN Details Online" },
      { name: "description", content: "Udyog Aadhaar Update provides businesses the option to modify or correct their UAN details online. Entrepreneurs can update essential business..." },
      { property: "og:title", content: "Udyog Aadhaar Update – Modify UAN Details Online" },
      { property: "og:description", content: "Udyog Aadhaar Update provides businesses the option to modify or correct their UAN details online. Entrepreneurs can update essential business..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Update" linkTitle="Udyog Aadhaar Update – Modify UAN Details Online" content={`Udyog Aadhaar Update provides businesses the option to modify or correct their UAN details online. Entrepreneurs can update essential business information, including name, address, activity, or ownership details, through Aadhaar-based OTP verification. Keeping your MSME profile accurate is crucial for accessing government schemes, subsidies, loans, and compliance with regulations. Updating your Udyog Aadhaar before migrating to Udyam ensures seamless transition to the new registration system. The process is fast, paperless, secure, and designed to maintain uninterrupted recognition of micro, small, and medium enterprises. By updating UAN records, businesses continue to benefit from historic MSME registration while preparing for future government support programs.`} html={html} />,
});
