import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-update.html?raw";

export const Route = createFileRoute("/udyam-registration-update")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Update | Modify MSME Certificate Details Online" },
      { name: "description", content: "Udyam Registration Update allows businesses to edit and update their MSME registration details online. Entrepreneurs can correct or change information..." },
      { property: "og:title", content: "Udyam Registration Update | Modify MSME Certificate Details Online" },
      { property: "og:description", content: "Udyam Registration Update allows businesses to edit and update their MSME registration details online. Entrepreneurs can correct or change information..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Update" linkTitle="Udyam Registration Update | Modify MSME Certificate Details Online" content={`Udyam Registration Update allows businesses to edit and update their MSME registration details online. Entrepreneurs can correct or change information such as business name, address, PAN, or Aadhaar-linked details through the secure Udyam portal. Keeping your registration information current ensures uninterrupted access to government schemes, bank loans, tenders, and other MSME benefits. The process is fully digital, paperless, and uses OTP verification for security. Step-by-step instructions guide users through the update process, ensuring accuracy and compliance. Updating your Udyam Registration helps micro, small, and medium enterprises maintain valid certificates, stay legally recognized, and enhance operational credibility for financial and government programs.`} html={html} />,
});
