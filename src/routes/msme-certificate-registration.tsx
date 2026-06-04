import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-registration.html?raw";

export const Route = createFileRoute("/msme-certificate-registration")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Registration - Steps to Register Your Business" },
      { name: "description", content: "MSME certificate registration is the official process through which businesses obtain recognition as a micro, small, or medium enterprise under the government’s regulatory framework. The registration process is carried out online through the Udyam portal, which requires basic business information, Aadhaar..." },
      { property: "og:title", content: "MSME Certificate Registration - Steps to Register Your Business" },
      { property: "og:description", content: "MSME certificate registration is the official process through which businesses obtain recognition as a micro, small, or medium enterprise under the government’s regulatory framework. The registration process is carried out online through the Udyam portal, which requires basic business information, Aadhaar..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Registration" linkTitle="MSME Certificate Registration - Steps to Register Your Business" html={html} />,
});
