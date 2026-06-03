import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/update-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Update Udyam Certificate — Edit Details with Consultancy Help" },
      { name: "description", content: "Update your existing Business Help Services certificate — address, NIC code, investment, turnover and more — with assistance." },
      { property: "og:title", content: "Update Udyam Certificate Online" },
      { property: "og:description", content: "Edit your Udyam certificate details with consultancy assistance from Business Help Services." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/update-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Update - How to Update Your MSME Details Online" html={html} />,
});
