import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/update-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Update Udyam Certificate — Edit Details with Consultancy Help" },
      { name: "description", content: "Update your existing Udyam Registration certificate — address, NIC code, investment, turnover and more — with assistance." },
      { property: "og:title", content: "Update Udyam Certificate Online" },
      { property: "og:description", content: "Edit your Udyam certificate details with consultancy assistance from Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Update Udyam Certificate">
      <p>
        Update your existing Udyam Registration certificate — change of business
        name, address, NIC activity, investment, turnover, mobile or email — with
        end-to-end consultancy assistance.
      </p>
      <p><Link to="/">Request an update →</Link></p>
    </PageHero>
  ),
});
