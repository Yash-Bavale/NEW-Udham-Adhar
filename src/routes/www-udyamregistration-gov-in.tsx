import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/www-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "www.udyamregistration.gov.in - Official MSME Registration Website" },
      { name: "description", content: "www.udyamregistration.gov.in is the official government portal for MSME registration and certification in India. It provides a secure, free, and fast digital platform for businesses to register as micro, small, or medium enterprises. Entrepreneurs and business owners can complete the registration using..." },
      { property: "og:title", content: "www.udyamregistration.gov.in - Official MSME Registration Website" },
      { property: "og:description", content: "www.udyamregistration.gov.in is the official government portal for MSME registration and certification in India. It provides a secure, free, and fast digital platform for businesses to register as micro, small, or medium enterprises. Entrepreneurs and business owners can complete the registration using..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="www.udyamregistration gov in" linkTitle="www.udyamregistration.gov.in - Official MSME Registration Website" html={html} />,
});
