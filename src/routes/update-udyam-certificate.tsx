import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/update-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Update Udyam Certificate — Edit Details with Consultancy Help" },
      { name: "description", content: "Update your existing Udyam Adhar certificate — address, NIC code, investment, turnover and more — with assistance." },
      { property: "og:title", content: "Update Udyam Certificate Online" },
      { property: "og:description", content: "Edit your Udyam certificate details with consultancy assistance from Udyam Adhar." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/update-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Update Udyam Certificate" linkTitle="Udyam Update - How to Update Your MSME Details Online" html={html} />,
});
