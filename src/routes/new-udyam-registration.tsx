import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

const TITLE = "New Udyam Registration";

export const Route = createFileRoute("/new-udyam-registration")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: "Apply for a new Udyam Registration online with end-to-end consultancy assistance from Udyam Adhar." },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Apply for a new Udyam Registration with consultancy help." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/new-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="New Udyam Registration" linkTitle="Udyam Registration Online - Digital MSME Registration Process" html={html} />,
});
