import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyamregistration.html?raw";

export const Route = createFileRoute("/udyamregistration")({
  head: () => ({
    meta: [
      { title: "Udyamregistration - Official MSME Registration Portal India" },
      { name: "description", content: "Udyamregistration serves as the official and trusted online gateway designed by the Government of India for completing the MSME registration process in a seamless, fast, and paperless manner. This platform is entirely free to use and is specifically created to help micro, small, and medium enterprises obtain their..." },
      { property: "og:title", content: "Udyamregistration - Official MSME Registration Portal India" },
      { property: "og:description", content: "Udyamregistration serves as the official and trusted online gateway designed by the Government of India for completing the MSME registration process in a seamless, fast, and paperless manner. This platform is entirely free to use and is specifically created to help micro, small, and medium enterprises obtain their..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyamregistration" linkTitle="Udyamregistration - Official MSME Registration Portal India" html={html} />,
});
