import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate.html?raw";

export const Route = createFileRoute("/msme-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate - Benefits and Online Registration" },
      { name: "description", content: "An MSME certificate is an official document issued by the Government of India to businesses recognized as Micro, Small, or Medium Enterprises under the Udyam registration system. This certificate holds significant importance as it enables enterprises to access a broad range of government-backed financial,..." },
      { property: "og:title", content: "MSME Certificate - Benefits and Online Registration" },
      { property: "og:description", content: "An MSME certificate is an official document issued by the Government of India to businesses recognized as Micro, Small, or Medium Enterprises under the Udyam registration system. This certificate holds significant importance as it enables enterprises to access a broad range of government-backed financial,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate" linkTitle="MSME Certificate - Benefits and Online Registration" html={html} />,
});
