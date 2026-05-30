import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SERVICES, GST_RATE, computeAmounts } from "@/lib/constants";

export const Route = createFileRoute("/pricing-transparency")({
  head: () => ({
    meta: [
      { title: "Pricing Transparency — Udyam Registration Consultancy" },
      { name: "description", content: "Transparent pricing for all Udyam Registration consultancy services. All fees are consultancy charges, not government fees." },
      { property: "og:title", content: "Pricing Transparency" },
      { property: "og:description", content: "See the full price list for our Udyam Registration consultancy services." },
    ],
  }),
  component: () => (
    <PageHero title="Pricing Transparency">
      <p>
        All charges below are <strong>consultancy and assistance service
        fees</strong>, exclusive of {Math.round(GST_RATE * 100)}% GST. They are
        not government fees — registration on the official Udyam portal is free.
      </p>

      <div className="not-prose overflow-x-auto rounded-lg border border-border mt-4">
        <table className="w-full text-sm">
          <thead className="bg-muted text-foreground">
            <tr>
              <th className="text-left p-3">Service</th>
              <th className="text-right p-3">Base Fee</th>
              <th className="text-right p-3">GST (18%)</th>
              <th className="text-right p-3">Total Payable</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s) => {
              const { baseAmount, gstAmount, totalAmount } = computeAmounts(s.price);
              return (
                <tr key={s.slug} className="border-t border-border">
                  <td className="p-3">{s.label}</td>
                  <td className="p-3 text-right">₹{baseAmount.toFixed(2)}</td>
                  <td className="p-3 text-right">₹{gstAmount.toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold">₹{totalAmount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Pricing is currently uniform across services and will move to dynamic
        per-service pricing in a future update.
      </p>
    </PageHero>
  ),
});
