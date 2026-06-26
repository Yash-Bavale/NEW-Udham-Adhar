import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-login.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-login")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Login | Access Your MSME Registration Online" },
      { name: "description", content: "Udyam Aadhaar Login enables entrepreneurs to securely access their MSME Udyam certificate and registration details online. Using Aadhaar-linked OTP..." },
      { property: "og:title", content: "Udyam Aadhaar Login | Access Your MSME Registration Online" },
      { property: "og:description", content: "Udyam Aadhaar Login enables entrepreneurs to securely access their MSME Udyam certificate and registration details online. Using Aadhaar-linked OTP..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-aadhaar-login" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Login" linkTitle="Udyam Aadhaar Login | Access Your MSME Registration Online" content={`Udyam Aadhaar Login enables entrepreneurs to securely access their MSME Udyam certificate and registration details online. Using Aadhaar-linked OTP verification, businesses can view, update, or print certificates instantly. The portal provides a paperless, secure, and user-friendly interface for managing all MSME-related documentation. Logging in allows access to subsidy programs, bank loans, tenders, and other government schemes. Step-by-step guidance ensures a seamless login experience. Keeping your login details secure ensures uninterrupted access to official records, helping micro, small, and medium enterprises maintain compliance and stay ready for government support opportunities.`} html={html} />,
});
