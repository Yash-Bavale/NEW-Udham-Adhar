import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-to-udyam-migration.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-to-udyam-migration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate" },
      { name: "description", content: "Udyog Aadhaar to Udyam Migration is the process for transferring old MSME registration details to the new Udyam Registration system. This step is..." },
      { property: "og:title", content: "Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate" },
      { property: "og:description", content: "Udyog Aadhaar to Udyam Migration is the process for transferring old MSME registration details to the new Udyam Registration system. This step is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/migrate-udyog-aadhaar-to-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar to Udyam Migration" linkTitle="Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate" content={`Udyog Aadhaar to Udyam Migration is the process for transferring old MSME registration details to the new Udyam Registration system. This step is mandatory for micro, small, and medium enterprises to continue availing government benefits, subsidies, and loans. Businesses can verify their Aadhaar, enter their Udyog Aadhaar Number, and update essential business details online. Upon successful migration, entrepreneurs receive a digitally signed Udyam Certificate instantly. This process ensures uninterrupted recognition, eligibility for government schemes, and compliance with current regulations. The migration portal provides clear instructions, a secure online environment, and paperless verification. By completing the migration, MSMEs upgrade to a modern registration system that simplifies certificate management, tender participation, and financial access, supporting long-term business growth.`} html={html} />,
});
