import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/complaint.html?raw";

export const Route = createFileRoute("/complaint")({
  head: () => ({
    meta: [
      { title: "Complaint — Business Help Services Consultancy" },
      { name: "description", content: "Complain Form Name / नाव Mobile No / मोबाईल नंबर Complaint / तक्रार I have read and agree to all the Terms & Conditions , Refund & Cancellation Policy, Con" },
      { property: "og:title", content: "Complaint" },
      { property: "og:description", content: "Complain Form Name / नाव Mobile No / मोबाईल नंबर Complaint / तक्रार I have read and agree to all the Terms & Conditions , Refund & Cancellation Policy, Con" },
    ],
  }),
  component: () => <WpPage title="Complaint" html={html} />,
});
