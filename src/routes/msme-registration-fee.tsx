import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-fee.html?raw";

export const Route = createFileRoute("/msme-registration-fee")({
  head: () => ({
    meta: [
      { title: "MSME Registration Fee - Free Online MSME Registration Process" },
      { name: "description", content: "MSME registration fee refers to the cost of registering a micro, small, or medium enterprise on the official Udyam portal. The government has made the registration process completely free, with no fees or hidden charges. Entrepreneurs can register their business online using Aadhaar verification, submit basic..." },
      { property: "og:title", content: "MSME Registration Fee - Free Online MSME Registration Process" },
      { property: "og:description", content: "MSME registration fee refers to the cost of registering a micro, small, or medium enterprise on the official Udyam portal. The government has made the registration process completely free, with no fees or hidden charges. Entrepreneurs can register their business online using Aadhaar verification, submit basic..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-fee" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Fee" linkTitle="MSME Registration Fee - Free Online MSME Registration Process" html={html} />,
});
