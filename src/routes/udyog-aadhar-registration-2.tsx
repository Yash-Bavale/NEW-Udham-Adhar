import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-2.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-2")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration – MSME Registration Process (Old)" },
      { name: "description", content: "Udyog Aadhar registration was the earlier system introduced by the Government of India to simplify and streamline the process of enrolling micro, small, and medium enterprises into the national MSME database. This earlier process allowed business owners to register online using their Aadhaar number and a few basic..." },
      { property: "og:title", content: "Udyog Aadhar Registration – MSME Registration Process (Old)" },
      { property: "og:description", content: "Udyog Aadhar registration was the earlier system introduced by the Government of India to simplify and streamline the process of enrolling micro, small, and medium enterprises into the national MSME database. This earlier process allowed business owners to register online using their Aadhaar number and a few basic..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration-2" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration" linkTitle="Udyog Aadhar Registration – MSME Registration Process (Old)" html={html} />,
});
