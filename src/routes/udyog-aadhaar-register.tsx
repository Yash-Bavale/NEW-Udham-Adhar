import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-register.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-register")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Register – MSME Registration for Small Businesses" },
      { name: "description", content: "Udyog Aadhaar Register was the former online system for registering MSMEs across India. It allowed small businesses to obtain a Udyog Aadhaar Number (UAN)..." },
      { property: "og:title", content: "Udyog Aadhaar Register – MSME Registration for Small Businesses" },
      { property: "og:description", content: "Udyog Aadhaar Register was the former online system for registering MSMEs across India. It allowed small businesses to obtain a Udyog Aadhaar Number (UAN)..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Register" linkTitle="Udyog Aadhaar Register – MSME Registration for Small Businesses" content={`Udyog Aadhaar Register was the former online system for registering MSMEs across India. It allowed small businesses to obtain a Udyog Aadhaar Number (UAN) using Aadhaar verification and basic enterprise details. Thousands of micro, small, and medium enterprises successfully registered, enabling them to access government schemes, financial assistance, and subsidies. Although the system has now been replaced by Udyam Registration, existing businesses can still access, update, and verify their UAN records online. Migration to Udyam ensures uninterrupted eligibility for MSME benefits, seamless certificate issuance, and digital recognition. The Udyog Aadhaar Register remains a valuable reference for historic MSME registration data and verification purposes.`} html={html} />,
});
