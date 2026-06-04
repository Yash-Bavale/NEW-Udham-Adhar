import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-apply.html?raw";

export const Route = createFileRoute("/udyam-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Apply – Registration Online" },
      { name: "description", content: "Looking to complete your Udyam apply process online without confusion? This guide makes it simple. Learn how to register your business under Udyam with..." },
      { property: "og:title", content: "Udyam Apply – Registration Online" },
      { property: "og:description", content: "Looking to complete your Udyam apply process online without confusion? This guide makes it simple. Learn how to register your business under Udyam with..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Apply" linkTitle="Udyam Apply – Registration Online" content={`Looking to complete your Udyam apply process online without confusion? This guide makes it simple. Learn how to register your business under Udyam with clear and easy-to-follow steps. Understand the eligibility criteria and details required before starting your application. Find out how to use your Aadhar number for quick and smooth verification. This page explains the full process in a way that is easy for beginners to understand. Discover the benefits of Udyam registration for small and medium businesses. Learn how registration can help you access government schemes and financial support. Avoid common mistakes that may delay your application process. Get helpful tips to ensure your details are accurate and properly submitted. Understand how to check your application status after completing registration. Find out how to update or correct your information if needed. This guide is useful for new entrepreneurs as well as existing business owners. All information is explained in a simple and practical manner for better clarity. Save time by following a structured and straightforward registration approach. Stay informed with the latest updates related to Udyam registration. Everything you need to know about the Udyam apply process is covered here. Start your registration today and move one step closer to growing your business.`} html={html} />,
});
