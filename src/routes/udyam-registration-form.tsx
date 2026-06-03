import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

const TITLE = "Udyam Registration Form | Fill MSME Application Online";
const DESCRIPTION = "Udyam Registration Form allows entrepreneurs to submit their MSME registration application online. The form captures essential business information, Aadhaar and PAN details, and enterprise classification. Filling the form accurately ensures quick issuance of the Udyam certificate in PDF format. This document is essential for bank loans, government subsidies, tenders, and compliance. The online process is paperless, secure, and straightforward. Step-by-step guidance helps users fill and submit the form correctly. Completing the Udyam Registration Form ensures legal recognition, access to government benefits, and smooth participation in MSME schemes, supporting growth and operational efficiency.";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-form" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Form" linkTitle="Udyam Registration Form - Online MSME Registration Application" html={html} />,
});
