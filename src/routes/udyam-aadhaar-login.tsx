import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-login.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-login")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Login — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Aadhaar Login enables entrepreneurs to securely access their MSME Udyam certificate and registration details online. Using Aadhaar-linked OTP verification, businesses can view, update, or print certificates instantly. The portal provides a paperless, secure, and user-friendly interface for managing all..." },
      { property: "og:title", content: "Udyam Aadhaar Login — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Aadhaar Login enables entrepreneurs to securely access their MSME Udyam certificate and registration details online. Using Aadhaar-linked OTP verification, businesses can view, update, or print certificates instantly. The portal provides a paperless, secure, and user-friendly interface for managing all..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-login" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Login" linkTitle="Udyam Aadhaar Login" html={html} />,
});
