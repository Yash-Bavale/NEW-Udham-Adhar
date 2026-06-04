import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Portal - Official MSME Registration Website" },
      { name: "description", content: "The Udyam portal is the Government of India’s official online platform dedicated to MSME registration, certificate downloads, and enterprise updates,..." },
      { property: "og:title", content: "Udyam Portal - Official MSME Registration Website" },
      { property: "og:description", content: "The Udyam portal is the Government of India’s official online platform dedicated to MSME registration, certificate downloads, and enterprise updates,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam portal" linkTitle="Udyam Portal - Official MSME Registration Website" content={`The Udyam portal is the Government of India’s official online platform dedicated to MSME registration, certificate downloads, and enterprise updates, offering a completely paperless and secure environment for business owners. This portal serves as the central hub for entrepreneurs seeking to register their businesses as Micro, Small, or Medium Enterprises, ensuring that the process is streamlined, quick, and accessible to users with varying levels of technical knowledge. By entering basic business details and completing Aadhaar-based authentication, entrepreneurs can obtain their Udyam Registration Number and digital MSME certificate instantly. The portal’s integrated verification system uses PAN, GST, and Aadhaar databases to ensure accuracy, reduce fraudulent entries, and automatically classify businesses according to MSME norms. Once registered, users can log in 24/7 to download their certificate, update business details, or check eligibility for government schemes and subsidies. The Udyam portal unlocks numerous benefits—including priority lending, loan subsidies, collateral-free credit programs, technological support, and tender participation—helping MSMEs enhance their financial stability and market presence. Its user-friendly design eliminates the need for physical visits to government offices, enabling entrepreneurs across India to complete registration from anywhere using a computer or mobile device. The portal represents the government’s commitment to digital empowerment, economic development, and the growth of small enterprises in the country. With round-the-clock accessibility, lifetime-valid certificates, and a transparent registration system, the Udyam portal stands as a trusted digital gateway for every entrepreneur seeking to formalize their business and unlock MSME benefits.`} html={html} />,
});
