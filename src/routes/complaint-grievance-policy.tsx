import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/grievance-redressal-policy.html?raw";

export const Route = createFileRoute("/complaint-grievance-policy")({
  head: () => ({
    meta: [
      { title: "Complaint & Grievance Policy — Business Help Services Consultancy" },
      { name: "description", content: "How to raise a complaint or grievance regarding our Business Help Services consultancy services." },
      { property: "og:title", content: "Complaint & Grievance Policy" },
      { property: "og:description", content: "Complaint and grievance redressal policy for Business Help Services." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/complaint-grievance-policy" },
    ],
  }),
  component: () => <WpPage title="Complaint & Grievance Policy" html={html} />,
});
