import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate Download | Get Official PDF Online" },
      { name: "description", content: "Udyam MSME Certificate Download allows entrepreneurs to instantly access and download their official MSME certificate in PDF format from the Udyam portal...." },
      { property: "og:title", content: "Udyam MSME Certificate Download | Get Official PDF Online" },
      { property: "og:description", content: "Udyam MSME Certificate Download allows entrepreneurs to instantly access and download their official MSME certificate in PDF format from the Udyam portal...." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate Download" linkTitle="Udyam MSME Certificate Download | Get Official PDF Online" content={`Udyam MSME Certificate Download allows entrepreneurs to instantly access and download their official MSME certificate in PDF format from the Udyam portal. By entering your Udyam Number and completing OTP verification, businesses can securely retrieve their certificate for printing and official use. The certificate serves as proof of enterprise classification and is essential for bank loans, government subsidiess, tenders, and MSME schemes. The process is fully digital, paperless, and user-friendly, ensuring accuracy and convenience. Step-by-step guidance helps business owners download the certificate without errors. Keeping the Udyam MSME Certificate accessible ensures compliance, official recognition, and uninterrupted access to financial and government benefits for micro, small, and medium enterprises.`} html={html} />,
});
