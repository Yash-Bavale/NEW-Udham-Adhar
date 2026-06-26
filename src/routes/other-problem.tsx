import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/other-problem")({
  head: () => ({
    meta: [
      { title: "Other Udyam Problems — Forgot OTP, Mobile, PAN/Aadhaar Issues" },
      { name: "description", content: "Help with forgotten registered mobile/email, PAN/Aadhaar name mismatch, and other Udyam Adhar issues." },
      { property: "og:title", content: "Other Udyam Adhar Problems" },
      { property: "og:description", content: "Get consultancy help for forgotten OTP, mobile/email recovery, PAN/Aadhaar corrections, and more." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/other-problem" },
    ],
  }),
  component: () => <SeoLandingPage title="Other Problem" linkTitle="Udyog Aadhar Registration" html={html} />,
});
