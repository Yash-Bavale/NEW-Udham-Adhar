import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-no.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-no")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" },
      { name: "description", content: "Udyog Aadhaar Number (UAN) is a unique identifier previously issued to micro, small, and medium enterprises (MSMEs) in India to avail government benefits,..." },
      { property: "og:title", content: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" },
      { property: "og:description", content: "Udyog Aadhaar Number (UAN) is a unique identifier previously issued to micro, small, and medium enterprises (MSMEs) in India to avail government benefits,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-no" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar No" linkTitle="Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" content={`Udyog Aadhaar Number (UAN) is a unique identifier previously issued to micro, small, and medium enterprises (MSMEs) in India to avail government benefits, subsidies, and schemes. Entrepreneurs could register online with basic business details and Aadhaar authentication to obtain their UAN instantly. Existing businesses can retrieve their UAN easily through the portal for verification, corrections, or updates. Businesses are encouraged to migrate their UAN to the new Udyam Registration system for faster, paperless, and digitally signed MSME certification. Keeping your UAN active ensures continuity of benefits and seamless access to historic MSME data, including certificate downloads, tender participation, and loan applications. This unique identification helps maintain compliance, credibility, and government recognition while supporting small and medium enterprises in operational and financial growth.`} html={html} />,
});
