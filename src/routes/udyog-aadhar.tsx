import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar.html?raw";

export const Route = createFileRoute("/udyog-aadhar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar - Old MSME Registration Process Explained" },
      { name: "description", content: "Udyog Aadhar was the earlier MSME registration framework introduced by the Government of India to simplify the process for micro, small, and medium enterprises seeking official recognition. Under this system, business owners could register online and receive a unique Udyog Aadhar Number (UAN), which served as a..." },
      { property: "og:title", content: "Udyog Aadhar - Old MSME Registration Process Explained" },
      { property: "og:description", content: "Udyog Aadhar was the earlier MSME registration framework introduced by the Government of India to simplify the process for micro, small, and medium enterprises seeking official recognition. Under this system, business owners could register online and receive a unique Udyog Aadhar Number (UAN), which served as a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar" linkTitle="Udyog Aadhar - Old MSME Registration Process Explained" html={html} />,
});
