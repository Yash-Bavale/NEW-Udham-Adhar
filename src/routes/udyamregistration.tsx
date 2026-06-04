import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyamregistration.html?raw";

export const Route = createFileRoute("/udyamregistration")({
  head: () => ({
    meta: [
      { title: "Udyamregistration - Official MSME Registration Portal India" },
      { name: "description", content: "Udyamregistration serves as the official and trusted online gateway designed by the Government of India for completing the MSME registration process in a..." },
      { property: "og:title", content: "Udyamregistration - Official MSME Registration Portal India" },
      { property: "og:description", content: "Udyamregistration serves as the official and trusted online gateway designed by the Government of India for completing the MSME registration process in a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyamregistration" linkTitle="Udyamregistration - Official MSME Registration Portal India" content={`Udyamregistration serves as the official and trusted online gateway designed by the Government of India for completing the MSME registration process in a seamless, fast, and paperless manner. This platform is entirely free to use and is specifically created to help micro, small, and medium enterprises obtain their valid Udyam Registration Number without complicated paperwork or long waiting times. The portal ensures high-level security, transparency, and compliance as it operates under the Ministry of MSME, making it one of the most reliable digital systems for entrepreneurs across the country. Businesses can complete their registration using basic details such as Aadhaar, PAN, and business information, after which the system instantly generates a verified Udyam Certificate. This certificate is an essential document that helps MSMEs unlock multiple government benefits including subsidies, collateral-free loans, reduced interest rates, preference in government tenders, credit-linked incentives, and various schemes intended to support small industries. Udyamregistration simplifies the entire onboarding process for new entrepreneurs as well as existing businesses that want to formalize their operations or migrate from older systems like Udyog Aadhaar. Since the portal is available 24/7, users can register from anywhere in India using any device without visiting government offices. Every piece of information submitted is digitally verified through Aadhaar-based authentication, ensuring accuracy, validity, and rapid approval. Once registered, businesses can also update their details, track their certificate, download the Udyam document anytime, and use it for banks, financial institutions, and government organizations. The platform reflects the government’s initiative to encourage entrepreneurship, boost small industries, and offer a simple system that supports India’s MSME sector. Whether you're starting a new business, expanding operations, or simply seeking official recognition to access government benefits, Udyamregistration gives you a smooth, efficient, and secure registration experience.`} html={html} />,
});
