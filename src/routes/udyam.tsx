import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam.html?raw";

export const Route = createFileRoute("/udyam")({
  head: () => ({
    meta: [
      { title: "Udyam - Government Portal for MSME Registration" },
      { name: "description", content: "Udyam is the official government portal dedicated to simplifying MSME registration for entrepreneurs across India, making the process more accessible,..." },
      { property: "og:title", content: "Udyam - Government Portal for MSME Registration" },
      { property: "og:description", content: "Udyam is the official government portal dedicated to simplifying MSME registration for entrepreneurs across India, making the process more accessible,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam" linkTitle="Udyam - Government Portal for MSME Registration" content={`Udyam is the official government portal dedicated to simplifying MSME registration for entrepreneurs across India, making the process more accessible, efficient, and transparent than ever before. This platform eliminates the complexities associated with earlier registration systems by offering a fully digital, paperless, and free method for obtaining official MSME recognition. Through Udyam, business owners can complete registration using their Aadhaar number and basic business details, after which they receive a digitally verified Udyam Certificate that serves as lifelong proof of their MSME status. One of the core advantages of the Udyam portal is its seamless integration with PAN, GST, and other government databases, ensuring accuracy and automatic classification of businesses into micro, small, or medium categories. This streamlined verification system helps reduce errors, speeds up approval times, and ensures all registered MSMEs gain quick access to government-backed benefits. With this certification, entrepreneurs can take advantage of priority sector lending, subsidies, credit guarantees, and participation in government tenders, all of which support business growth and financial stability. The portal is designed to be user-friendly, secure, and accessible from any device, making it easier for individuals with limited technical knowledge to complete their registration without external assistance. Businesses already registered under Udyog Aadhaar can also migrate effortlessly to the Udyam system and update their details whenever required. By offering a transparent and dependable registration system, Udyam strengthens India’s MSME ecosystem and provides the foundation for small businesses to grow, compete, and access new markets. Whether you are launching a startup, expanding your enterprise, or formalizing an existing business, Udyam ensures a hassle-free and reliable path to official MSME recognition.`} html={html} />,
});
