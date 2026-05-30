import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/www.udyamadhar.in.html?raw";

export const Route = createFileRoute("/www/udyamadhar/in")({
  head: () => ({
    meta: [
      { title: "Home — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Form Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Home" },
      { property: "og:description", content: "Udyam Registration Form Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <WpPage title="Home" html={html} />,
});
