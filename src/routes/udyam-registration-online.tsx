import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online - Digital MSME Registration Process" },
      { name: "description", content: "Udyam registration online is the government’s official digital platform for registering your business as a Micro, Small, or Medium Enterprise. The process is completely paperless, free, and designed to be completed quickly using only Aadhaar and PAN details for verification. Online registration ensures that your..." },
      { property: "og:title", content: "Udyam Registration Online - Digital MSME Registration Process" },
      { property: "og:description", content: "Udyam registration online is the government’s official digital platform for registering your business as a Micro, Small, or Medium Enterprise. The process is completely paperless, free, and designed to be completed quickly using only Aadhaar and PAN details for verification. Online registration ensures that your..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Online" linkTitle="Udyam Registration Online - Digital MSME Registration Process" html={html} />,
});
