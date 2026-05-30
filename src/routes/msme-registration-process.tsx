import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
  head: () => ({
    meta: [
      { title: "MSME Registration Process – Step-by-Step Guide for Udyam MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Registration Process Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "MSME Registration Process – Step-by-Step Guide for Udyam MSM" },
      { property: "og:description", content: "MSME Registration Process Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="MSME Registration Process – Step-by-Step Guide for Udyam MSM" html={html} />,
});
