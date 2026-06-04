import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — CRM" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: CustomersPlaceholder,
});

function CustomersPlaceholder() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="text-sm text-muted-foreground">
        Customer 360 list ships in Turn 2 of Phase 5. The data model is live and being populated — every
        new lead / payment / application now rolls up to a unique customer behind the scenes.
      </p>
    </div>
  );
}
