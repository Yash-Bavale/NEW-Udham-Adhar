import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { LifeBuoy, ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Support Tickets</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          Inbound customer issues are tracked alongside complaints in this CRM.
        </p>
      </div>

      <SectionCard>
        <div className="p-6 flex items-start gap-4">
          <div className="size-10 shrink-0 rounded-lg flex items-center justify-center" style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}>
            <LifeBuoy className="size-5" />
          </div>
          <div className="text-sm space-y-2" style={{ color: "var(--admin-fg-muted)" }}>
            <p style={{ color: "var(--admin-fg)" }} className="font-medium">Tickets live inside the Complaints workspace.</p>
            <p>
              Every customer-raised issue — authority queries, document rejections, payment disputes — is captured as a
              complaint record with severity (priority), category, SLA timer, and assignment. Use the Complaints page
              for priority pills (High / Medium / Low maps to Critical / High / Normal), status (Open → In Progress →
              Resolved → Closed), and SLA tracking.
            </p>
            <Link
              to="/admin/complaints"
              className="inline-flex items-center gap-1.5 mt-1 font-medium"
              style={{ color: "var(--admin-accent)" }}
            >
              Open Complaints workspace <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
