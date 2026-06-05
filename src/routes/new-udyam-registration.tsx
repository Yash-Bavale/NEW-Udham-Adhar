import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

const TITLE = "Udyam New Registration";

export const Route = createFileRoute("/new-udyam-registration")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: "Udyam new registration is designed for businesses applying for MSME certification for the first time on the official government portal. The process is..." },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Udyam new registration is designed for businesses applying for MSME certification for the first time on the official government portal. The process is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/new-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam New Registration" linkTitle="Udyam New Registration - Step-by-Step MSME Registration Guide" content={`Udyam New Registration is designed for businesses applying for MSME certification for the first time on the official government portal. The process is completely free, paperless, and requires only basic business information and Aadhaar verification. Upon successful registration, businesses receive a unique Udyam Registration Number and a digitally signed MSME certificate instantly, providing legal recognition as a Micro, Small, or Medium Enterprise. This certification opens doors to various government schemes, financial support, interest-free or collateral-free loans, priority sector lending, and eligibility for procurement tenders. Udyam New Registration streamlines business formalization, enhances credibility with banks and clients, and ensures compliance with government regulations. Entrepreneurs and startups can complete the process from anywhere, download the certificate instantly, and update information whenever necessary, ensuring continued access to MSME benefits. By registering as a new MSME, businesses can leverage government resources, build trust, and strengthen their position in India’s competitive market ecosystem.`} html={html} />,
});
