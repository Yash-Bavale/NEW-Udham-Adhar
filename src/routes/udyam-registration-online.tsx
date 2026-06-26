import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online - Digital MSME Registration Process" },
      { name: "description", content: "Udyam registration online is the government’s official digital platform for registering your business as a Micro, Small, or Medium Enterprise. The process..." },
      { property: "og:title", content: "Udyam Registration Online - Digital MSME Registration Process" },
      { property: "og:description", content: "Udyam registration online is the government’s official digital platform for registering your business as a Micro, Small, or Medium Enterprise. The process..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Online" linkTitle="Udyam Registration Online - Digital MSME Registration Process" content={`Udyam registration online is the government’s official digital platform for registering your business as a Micro, Small, or Medium Enterprise. The process is completely paperless, free, and designed to be completed quickly using only Aadhaar and PAN details for verification. Online registration ensures that your business receives a unique Udyam Registration Number and a digitally signed MSME certificate instantly, providing legal proof of your enterprise status. This certificate unlocks multiple government benefits, including collateral-free loans, interest subsidies, access to procurement tenders, technology support, and eligibility for reimbursement and incentive schemes. Udyam registration online integrates with PAN and GST databases to ensure accurate business classification, prevent duplication, and maintain compliance with government norms. Entrepreneurs, startups, and existing businesses can complete the registration from any device with internet access, eliminating paperwork and reducing administrative delays. By registering online, businesses gain formal recognition, enhanced credibility with financial institutions and clients, and easy access to government programs aimed at fostering entrepreneurship, growth, and market expansion. The Udyam portal provides a secure, reliable, and user-friendly platform for MSME registration, making the process accessible to businesses across India while enabling them to focus on growth and long-term sustainability.`} html={html} />,
});
