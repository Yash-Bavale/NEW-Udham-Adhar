import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Udyam Registration Consultancy" },
      { name: "description", content: "Disclaimer regarding the private consultancy services offered on this website." },
      { property: "og:title", content: "Disclaimer" },
      { property: "og:description", content: "Important disclaimer from Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Disclaimer">
      <p>
        Business Help Services is a private consultancy and assistance service
        provider. We are <strong>not affiliated with, authorized by, endorsed
        by, or associated with any government authority or department</strong>,
        including but not limited to the Ministry of Micro, Small and Medium
        Enterprises (MSME) or the Udyam Registration portal.
      </p>
      <p>
        All charges collected on this website are strictly consultancy and
        assistance service fees only. Official government registration on the
        Udyam portal is free of cost.
      </p>
    </PageHero>
  ),
});
