import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate — Get a Copy with Consultancy Help" },
      { name: "description", content: "Lost your Udyam certificate? Get assistance to download a fresh signed copy of your Udyam Registration certificate." },
      { property: "og:title", content: "Download Udyam Certificate Online" },
      { property: "og:description", content: "Download a copy of your Udyam Registration certificate with consultancy assistance." },
    ],
  }),
  component: () => (
    <PageHero title="Download Udyam Certificate">
      <p>
        Get assistance to download a fresh, digitally-signed copy of your Udyam
        Registration certificate using your registration number and registered
        mobile or email.
      </p>
      <p><Link to="/">Request your download →</Link></p>
    </PageHero>
  ),
});
