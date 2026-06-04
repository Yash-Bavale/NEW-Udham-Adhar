import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-application.html?raw";

export const Route = createFileRoute("/udyam-application")({
  head: () => ({
    meta: [
      { title: "Udyam Application Online | Apply for MSME Registration (Udyam Portal)" },
      { name: "description", content: "The Udyam Application online portal simplifies MSME registration for micro, small, and medium enterprises in India. Entrepreneurs can apply using their..." },
      { property: "og:title", content: "Udyam Application Online | Apply for MSME Registration (Udyam Portal)" },
      { property: "og:description", content: "The Udyam Application online portal simplifies MSME registration for micro, small, and medium enterprises in India. Entrepreneurs can apply using their..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-application" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Application" linkTitle="Udyam Application Online | Apply for MSME Registration (Udyam Portal)" content={`The Udyam Application online portal simplifies MSME registration for micro, small, and medium enterprises in India. Entrepreneurs can apply using their Aadhaar number and basic business information to obtain a unique Udyam Registration Number instantly. The process is completely digital, paperless, and free of cost. Upon approval, businesses receive a digitally signed MSME certificate that can be downloaded for official use. The Udyam Registration enables access to government loans, subsidies, tax benefits, and participation in tenders, supporting business growth and credibility. Detailed step-by-step instructions guide users through eligibility, required documents, and application procedures, ensuring error-free registration. Existing businesses can also update their details or migrate from Udyog Aadhaar seamlessly. By completing the Udyam Application, MSMEs unlock multiple government schemes and financial incentives essential for operational and financial success.`} html={html} />,
});
