import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card.html?raw";

export const Route = createFileRoute("/udyam-card")({
  head: () => ({
    meta: [
      { title: "Udyam Card - Official MSME Registration Card
Meta Description: The Udyam card is the official digital MSME registration card issued to businesses after successful registration on the Udyam portal. It contains the unique Udyam Registration Number, business details, and digital verification. The card serves as proof of MSME status, allowing businesses to access government schemes, loans, subsidies, and procurement benefits. Entrepreneurs can download the card anytime online, ensuring they have instant and secure access to official certification. The Udyam card simplifies verification by banks, clients, and government authorities while maintaining compliance with regulations. It also allows businesses to update registration details and continue availing MSME benefits seamlessly. By holding a Udyam card, startups, small businesses, and medium enterprises gain credibility, formal recognition, and eligibility for financial and operational support programs aimed at promoting growth and sustainability." },
      { name: "description", content: "Expert consultancy assistance for Udyam card. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Card - Official MSME Registration Card
Meta Description: The Udyam card is the official digital MSME registration card issued to businesses after successful registration on the Udyam portal. It contains the unique Udyam Registration Number, business details, and digital verification. The card serves as proof of MSME status, allowing businesses to access government schemes, loans, subsidies, and procurement benefits. Entrepreneurs can download the card anytime online, ensuring they have instant and secure access to official certification. The Udyam card simplifies verification by banks, clients, and government authorities while maintaining compliance with regulations. It also allows businesses to update registration details and continue availing MSME benefits seamlessly. By holding a Udyam card, startups, small businesses, and medium enterprises gain credibility, formal recognition, and eligibility for financial and operational support programs aimed at promoting growth and sustainability." },
      { property: "og:description", content: "Expert consultancy assistance for Udyam card. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam card" linkTitle="Udyam Card - Official MSME Registration Card
Meta Description: The Udyam card is the official digital MSME registration card issued to businesses after successful registration on the Udyam portal. It contains the unique Udyam Registration Number, business details, and digital verification. The card serves as proof of MSME status, allowing businesses to access government schemes, loans, subsidies, and procurement benefits. Entrepreneurs can download the card anytime online, ensuring they have instant and secure access to official certification. The Udyam card simplifies verification by banks, clients, and government authorities while maintaining compliance with regulations. It also allows businesses to update registration details and continue availing MSME benefits seamlessly. By holding a Udyam card, startups, small businesses, and medium enterprises gain credibility, formal recognition, and eligibility for financial and operational support programs aimed at promoting growth and sustainability." html={html} />,
});
