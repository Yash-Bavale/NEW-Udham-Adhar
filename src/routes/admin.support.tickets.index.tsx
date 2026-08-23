import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/support/tickets/")({
  head: () => ({
    meta: [
      { title: "Support Inbox — BHS CRM" },
      { name: "description", content: "Pick a ticket from the list to open the conversation." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EmptyState,
});

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
        <MessageSquare className="h-7 w-7 text-slate-400" />
      </div>
      <h2 className="text-base font-semibold text-slate-800">Select a ticket to view the conversation</h2>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        Pick a ticket from the list on the left. New inbound customer emails will land here automatically.
      </p>
    </div>
  );
}
