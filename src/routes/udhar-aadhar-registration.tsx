import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhar-aadhar-registration.html?raw";

export const Route = createFileRoute("/udhar-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udhar Aadhar Registration Online – Easy Process, Eligibility , Eligibility & Benefits Guide" },
      { name: "description", content: "Get complete information on Udhar Aadhar registration and how to apply online easily and securely. Learn the step-by-step process, required documents, and..." },
      { property: "og:title", content: "Udhar Aadhar Registration Online – Easy Process, Eligibility , Eligibility & Benefits Guide" },
      { property: "og:description", content: "Get complete information on Udhar Aadhar registration and how to apply online easily and securely. Learn the step-by-step process, required documents, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhar Aadhar Registration Online" linkTitle="Udhar Aadhar Registration Online – Easy Process, Eligibility , Eligibility & Benefits Guide" content={`Get complete information on Udhar Aadhar registration and how to apply online easily and securely. Learn the step-by-step process, required documents, and eligibility criteria in simple language. Understand how Aadhar-based verification ensures faster approval and smooth processing. Find out how to link your mobile number with Aadhar for seamless registration. Discover the benefits of using Aadhar for instant Udhar access and digital authentication. Avoid common mistakes with helpful tips and expert guidance. This guide covers both online and offline methods for user convenience. Stay updated with the latest rules and important updates related to Aadhar usage. Learn how to track your application status and make corrections if needed. Security tips are included to help protect your personal information. Perfect for beginners and users looking to update their details. Simple, clear, and reliable information all in one place. Start your Udhar registration today with confidence and ease.`} html={html} />,
});
