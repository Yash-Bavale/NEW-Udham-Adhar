import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, FileCheck2, Upload, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";

interface Props {
  stage: OrderStage;
  leadId?: string | null;
  leadCode?: string | null;
  onScrollTo: (target: "fulfillment" | "form" | "documents" | "notes" | "consultation" | "workflow") => void;
}

/**
 * Stage Actions Panel — surfaces the single most important next action
 * for the current stage so employees don't have to hunt for it.
 */
export function StageActionsPanel({ stage, leadId, leadCode, onScrollTo }: Props) {
  const meta = STAGE_META[stage];

  let title = "Next Step";
  let helper = "";
  let primary: React.ReactNode = null;

  switch (stage) {
    case "lead_received":
      title = "Send payment link to customer";
      helper = "Customer hasn't paid yet. Share the payment link via WhatsApp or email.";
      primary = leadId ? (
        <Button asChild size="sm">
          <Link to="/admin/leads/$leadId" params={{ leadId }}>
            Open Lead <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      ) : null;
      break;
    case "payment_pending":
      title = "Follow up on pending payment";
      helper = "Resend payment link or call the customer to confirm intent.";
      primary = leadId ? (
        <Button asChild size="sm">
          <Link to="/admin/leads/$leadId" params={{ leadId }}>
            Open Lead <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      ) : null;
      break;
    case "payment_done":
      title = "Wait for customer to submit service form";
      helper = leadCode
        ? "Resend the onboarding form if the customer hasn't filled it."
        : "Service form awaited from customer.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("form")}>
          <Mail className="size-3.5 mr-1.5" /> View / Resend Form
        </Button>
      );
      break;
    case "consultation_pending":
      title = "Call customer and set final service";
      helper = "This is a Talk-to-Expert order. Discuss the need, select the service, and the payment link will go automatically.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("consultation")} className="bg-amber-600 hover:bg-amber-700 text-white">
          Set Service <ArrowRight className="size-3.5 ml-1" />
        </Button>
      );
      break;
    case "form_submitted":
      title = "Review submitted form & documents";
      helper = "Verify the data, then move to In Progress or request corrections.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("fulfillment")}>
          Update Status <ArrowRight className="size-3.5 ml-1" />
        </Button>
      );
      break;
    case "under_review":
    case "in_progress":
      title = "Work the application";
      helper = "Process the request and submit to the government portal when ready.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("fulfillment")}>
          Update Status <ArrowRight className="size-3.5 ml-1" />
        </Button>
      );
      break;
    case "submitted_to_govt":
      title = "Awaiting government processing";
      helper = "Mark as Under Processing once the portal acknowledges, then upload the certificate.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("fulfillment")}>
          <Send className="size-3.5 mr-1.5" /> Update Status
        </Button>
      );
      break;
    case "under_processing":
      title = "Upload the issued certificate";
      helper = "Once the certificate is generated, upload it to complete the order.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("fulfillment")}>
          <Upload className="size-3.5 mr-1.5" /> Upload Certificate
        </Button>
      );
      break;
    case "certificate_ready":
      title = "Confirm completion";
      helper = "Certificate is uploaded. Complete the order to trigger the delivery email.";
      primary = (
        <Button size="sm" onClick={() => onScrollTo("fulfillment")}>
          <FileCheck2 className="size-3.5 mr-1.5" /> Mark Completed
        </Button>
      );
      break;
    case "completed":
      title = "Order completed";
      helper = "Certificate delivered to the customer. No further action required.";
      break;
    case "uninterested":
      title = "Lead marked uninterested";
      helper = "Add an internal note if the customer re-engages.";
      primary = (
        <Button size="sm" variant="outline" onClick={() => onScrollTo("notes")}>
          Add Note
        </Button>
      );
      break;
    case "refund_requested":
      title = "Refund pending review";
      helper = "Process the refund from the payments panel or reject with a note.";
      primary = (
        <Button size="sm" variant="outline" onClick={() => onScrollTo("notes")}>
          Open Notes
        </Button>
      );
      break;
    case "refunded":
      title = "Order refunded";
      helper = "Payment has been returned to the customer. Order is closed.";
      break;
  }

  const tone =
    meta.side === "exception"
      ? "border-rose-200 bg-rose-50"
      : stage === "completed"
        ? "border-emerald-200 bg-emerald-50"
        : "border-blue-200 bg-blue-50";

  return (
    <div className={`rounded-lg border p-4 flex items-start justify-between gap-4 ${tone}`}>
      <div className="flex items-start gap-3 min-w-0">
        {meta.side === "exception" ? (
          <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <ArrowRight className="size-5 text-blue-600 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            {meta.label} · Next Step
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">{title}</div>
          {helper && <div className="text-xs text-slate-600 mt-1">{helper}</div>}
        </div>
      </div>
      {primary && <div className="shrink-0">{primary}</div>}
    </div>
  );
}
