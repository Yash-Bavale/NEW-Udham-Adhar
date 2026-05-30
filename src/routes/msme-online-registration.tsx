import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-online-registration.html?raw";

export const Route = createFileRoute("/msme-online-registration")({
  head: () => ({
    meta: [
      { title: "MSME Online Registration - Easy Udyam Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Online Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "MSME Online Registration - Easy Udyam Registration Process" },
      { property: "og:description", content: "MSME Online Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <WpPage title="MSME Online Registration - Easy Udyam Registration Process" html={html} />,
});
