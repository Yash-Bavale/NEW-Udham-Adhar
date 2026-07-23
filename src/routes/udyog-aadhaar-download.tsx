import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Download | Old UAN Certificate Online" },
      { name: "description", content: "Udyog Aadhaar Download allows businesses to retrieve their old Udyog Aadhaar (UAN) certificate through the official portal using a registered mobile..." },
      { property: "og:title", content: "Udyog Aadhaar Download | Old UAN Certificate Online" },
      { property: "og:description", content: "Udyog Aadhaar Download allows businesses to retrieve their old Udyog Aadhaar (UAN) certificate through the official portal using a registered mobile..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Download" linkTitle="Udyog Aadhaar Download | Old UAN Certificate Online" content={`Udyog Aadhaar Download allows businesses to retrieve their old Udyog Aadhaar (UAN) certificate through the official portal using a registered mobile number. The certificate PDF can be printed or used to migrate your UAN to the new Udyam Registration system. This process is useful for businesses still transitioning from Udyog Aadhaar to Udyam. The download is secure, paperless, and easy to follow, ensuring uninterrupted access to MSME documentation. Maintaining an updated UAN or migrated certificate ensures compliance with government regulations, eligibility for loans, subsidies, tenders, and other MSME benefits. Step-by-step instructions guide entrepreneurs through downloading and printing their Udyog Aadhaar certificate accurately.`} html={html} />,
});
