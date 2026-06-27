import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft, LayoutDashboard, User2, FileText, Workflow, Mail, Activity,
  Phone, MessageCircle, Mail as MailIcon, FileText as FileIcon, Upload, FileCheck2, Printer,
  AlertCircle, Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { StageStepper } from "./StageStepper";
import { CustomerProfileCard } from "./CustomerProfileCard";
import { CustomerJourneyMap } from "./CustomerJourneyMap";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { OrderDocumentsPanel } from "@/components/admin/OrderDocumentsPanel";
import { OrderPaymentsPanel } from "@/components/admin/OrderPaymentsPanel";
import { OrderWorkflowPanel } from "./OrderWorkflowPanel";
import { ProcessingChecklist } from "@/components/admin/ProcessingChecklist";
import { UnifiedTimeline } from "@/components/admin/UnifiedTimeline";
import { StageActionsPanel } from "@/components/admin/StageActionsPanel";
import { ConvertConsultationPanel } from "@/components/admin/ConvertConsultationPanel";
import { LeadEmailsTab } from "@/components/admin/LeadEmailsTab";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";
import { formatIST, relativeIST } from "@/lib/datetime";

interface Props {
  orderId: string;
  data: any;
  hideAmount: boolean;
  staff: any[];
  onAssign: (id: string | null) => void;
  onRequestDocs: () => void;
  stage: OrderStage;
  timestamps: Partial<Record<OrderStage, string | null>>;
  showConsultationPanel: boolean;
  consultationMode: "select" | "awaiting_payment";
  canComplete: boolean;
  notesNode: React.ReactNode;
}

const TAB_META = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, color: "from-indigo-500 to-blue-600" },
  { id: "customer", label: "Customer", icon: User2, color: "from-cyan-500 to-sky-600" },
  { id: "form", label: "Form & Docs", icon: FileText, color: "from-violet-500 to-fuchsia-600" },
  { id: "workflow", label: "Workflow", icon: Workflow, color: "from-amber-500 to-orange-600" },
  { id: "emails", label: "Emails", icon: Mail, color: "from-rose-500 to-pink-600" },
  { id: "activity", label: "Activity", icon: Activity, color: "from-emerald-500 to-teal-600" },
];

export function WorkspaceShell(p: Props) {
  const [tab, setTab] = useState("overview");
  const { application, lead, customer, service, payments, paymentStatus, total, documents, events, stageMeta } = p.data;
  const current = (application.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const meta = STAGE_META[p.stage];
  const isException = meta.side === "exception";

  const cMobile = customer?.primary_mobile ?? lead?.mobile ?? null;
  const cEmail = customer?.primary_email ?? lead?.email ?? null;
  const waPhone = cMobile ? String(cMobile).replace(/\D/g, "") : "";
  const waUrl = waPhone ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}` : null;
  const whatsappText = encodeURIComponent(
    `Hi, this is regarding your ${service?.service_name ?? lead?.service ?? "service"} application (${application.application_code}).`,
  );
  const waWithText = waUrl ? `${waUrl}?text=${whatsappText}` : null;

  return (
    <div className="space-y-4 -mt-2 pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to orders
        </Link>
        <AddTaskDialog defaultApplicationId={p.orderId} defaultLeadId={application.lead_id ?? null} />
      </div>

      {/* Gradient sticky header */}
      <div className="sticky top-[56px] z-20 -mx-6 px-6 py-4 backdrop-blur-md border-b border-indigo-100 bg-gradient-to-r from-indigo-50/95 via-white/95 to-cyan-50/95">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base font-extrabold tracking-tight text-slate-900">
                {application.application_code}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm bg-gradient-to-r ${
                isException ? "from-rose-500 to-red-500" :
                meta.tone === "emerald" ? "from-emerald-500 to-teal-500" :
                meta.tone === "indigo" ? "from-indigo-500 to-blue-500" :
                meta.tone === "violet" ? "from-violet-500 to-fuchsia-500" :
                meta.tone === "amber" ? "from-amber-500 to-orange-500" :
                "from-sky-500 to-blue-500"
              }`}>
                {meta.label}
              </span>
              {isException && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                  <AlertCircle className="size-3" /> Needs attention
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-700 flex-wrap">
              <span className="font-semibold truncate">{customer?.name ?? lead?.name ?? "—"}</span>
              {cMobile && <><span className="opacity-40">·</span><span className="font-mono text-xs">{cMobile}</span></>}
              {cEmail && <><span className="opacity-40">·</span><span className="text-xs truncate">{cEmail}</span></>}
              <span className="opacity-40">·</span>
              <span className="text-xs text-indigo-600 font-medium truncate">{service?.service_name ?? lead?.service ?? "—"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Meta label="Created"><Clock className="size-3 inline mr-1 opacity-60" />{relativeIST(application.created_at)}</Meta>
            {!p.hideAmount && (
              <Meta label="Payment">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                  paymentStatus === "Refunded" || paymentStatus === "Failed" ? "bg-rose-100 text-rose-700" :
                  "bg-amber-100 text-amber-800"
                }`}>{paymentStatus}</span>
              </Meta>
            )}
            {!p.hideAmount && (
              <Meta label="Total">
                <span className="font-bold text-sm text-slate-900">₹{Number(total ?? 0).toLocaleString("en-IN")}</span>
              </Meta>
            )}
            <Meta label="Assigned">
              <select
                value={application.assigned_to ?? ""}
                onChange={(e) => p.onAssign(e.target.value || null)}
                className="rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs max-w-[180px] font-medium"
              >
                <option value="">Unassigned</option>
                {p.staff.map((s: any) => <option key={s.id} value={s.id}>{s.display_name || s.email}</option>)}
              </select>
            </Meta>
          </div>
        </div>
      </div>

      {/* Stage stepper */}
      <StageStepper stage={p.stage} timestamps={p.timestamps} onPick={() => setTab("workflow")} />

      {/* Persistent action bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <ActionBtn href={cMobile ? `tel:${cMobile}` : null} icon={Phone} label="Call" color="indigo" />
        <ActionBtn href={waWithText} icon={MessageCircle} label="WhatsApp" color="emerald" external />
        <ActionBtn href={cEmail ? `mailto:${cEmail}` : null} icon={MailIcon} label="Email" color="cyan" />
        <span className="w-px h-6 bg-slate-200 mx-1" />
        <ActionBtn onClick={p.onRequestDocs} icon={FileIcon} label="Request Docs" color="violet" />
        <ActionBtn onClick={() => setTab("form")} icon={Upload} label="Upload Certificate" color="amber" />
        {p.canComplete && (
          <ActionBtn onClick={() => setTab("workflow")} icon={FileCheck2} label="Complete Order" color="primary" />
        )}
        <div className="ml-auto">
          <ActionBtn onClick={() => window.print()} icon={Printer} label="Print" color="slate" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full justify-start bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200 p-1.5 h-auto rounded-2xl overflow-x-auto flex-nowrap">
          {TAB_META.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className={`gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all data-[state=active]:shadow-md data-[state=active]:text-white ${
                  active ? `bg-gradient-to-r ${t.color} text-white` : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="size-4" />
                {t.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <TabsContent value="overview" className="space-y-4 mt-0 animate-fade-in">
              <CustomerJourneyMap
                application={application}
                paymentSuccessfulAt={(p.data as any).paymentSuccessfulAt}
                stageMeta={stageMeta}
                workflowStatus={(application as any).workflow_status}
                closureStage={(application as any).closure_stage}
                closureNextAt={(application as any).closure_next_at}
                closureReasonLabel={(application as any).closure_reason_code}
              />
              {p.showConsultationPanel ? (
                <ConvertConsultationPanel
                  leadId={lead.id} leadCode={lead.lead_code}
                  mode={p.consultationMode}
                  customerName={customer?.name ?? lead?.name ?? null}
                  customerMobile={cMobile}
                  service={service?.service_name ?? lead?.service ?? null}
                  totalAmount={total ?? (lead?.total_amount != null ? Number(lead.total_amount) : null)}
                />
              ) : (
                <>
                  <StageActionsPanel
                    stage={p.stage}
                    leadId={lead?.id ?? null}
                    leadCode={lead?.lead_code ?? null}
                    onScrollTo={() => setTab("form")}
                  />
                  <ProcessingChecklist payments={payments} documents={documents} application={application} hideAmount={p.hideAmount} />
                </>
              )}
            </TabsContent>

            <TabsContent value="customer" className="space-y-4 mt-0 animate-fade-in">
              <CustomerProfileCard customer={customer} lead={lead} />
            </TabsContent>

            <TabsContent value="form" className="space-y-4 mt-0 animate-fade-in">
              {p.showConsultationPanel ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                  This is a <b>Talk-to-Expert</b> order. The post-payment service form will appear here once you select the customer's service in the <b>Overview</b> tab and the second payment is received.
                </div>
              ) : (
                <FormSubmissionPanel applicationId={application.id} />
              )}
              <OrderDocumentsPanel
                orderId={p.orderId}
                documents={documents}
                deletedAt={application.documents_deleted_at}
                deletedReason={application.documents_deleted_reason}
                hideMoney={p.hideAmount}
              />
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4 mt-0 animate-fade-in">
              {p.showConsultationPanel ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                  This is a <b>Talk-to-Expert</b> order. The post-payment service workflow appears here once you select the customer's service in the <b>Overview</b> tab and the second payment is received.
                </div>
              ) : (
                <OrderWorkflowPanel
                  applicationId={application.id}
                  current={current}
                  workflowStatus={(application as any).workflow_status}
                  closureStage={(application as any).closure_stage}
                  closureNextAt={(application as any).closure_next_at}
                  cancellationRequestedAt={(application as any).cancellation_requested_at}
                  reasonCode={(application as any).closure_reason_code}
                  reasonText={(application as any).closure_reason_text}
                />
              )}
            </TabsContent>



            <TabsContent value="emails" className="space-y-4 mt-0 animate-fade-in">
              {lead?.id ? (
                <LeadEmailsTab leadId={lead.id} leadService={service?.service_name ?? lead?.service ?? ""} />
              ) : (
                <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">No lead linked.</div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0 animate-fade-in">
              {p.notesNode}
              <UnifiedTimeline
                events={events}
                payments={p.hideAmount ? [] : payments}
                documents={documents}
                createdAt={application.created_at}
              />
            </TabsContent>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600 mb-2">Customer</div>
              <div className="text-sm font-bold text-slate-900">{customer?.name ?? lead?.name ?? "—"}</div>
              {cMobile && <div className="text-xs mt-0.5 font-mono text-slate-600">{cMobile}</div>}
              {cEmail && <div className="text-xs mt-0.5 break-all text-slate-600">{cEmail}</div>}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cMobile && <a href={`tel:${cMobile}`} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"><Phone className="size-3" />Call</a>}
                {waUrl && <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"><MessageCircle className="size-3" />WhatsApp</a>}
                {cEmail && <a href={`mailto:${cEmail}`} className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-cyan-100"><MailIcon className="size-3" />Email</a>}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 shadow-sm bg-gradient-to-br ${
              isException ? "from-rose-50 to-white border-rose-200" : "from-emerald-50 to-white border-emerald-100"
            }`}>
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-2">Current Stage</div>
              <div className="text-lg font-extrabold text-slate-900">{meta.label}</div>
              <div className="text-xs mt-1 text-slate-500">Entered {formatIST(p.timestamps[p.stage])}</div>
            </div>

            {!p.hideAmount && <OrderPaymentsPanel payments={payments} />}

            <OrderDocumentsPanel
              orderId={p.orderId}
              documents={documents}
              deletedAt={application.documents_deleted_at}
              deletedReason={application.documents_deleted_reason}
              hideMoney={p.hideAmount}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9.5px] uppercase tracking-[0.14em] font-bold text-indigo-500/70">{label}</span>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function ActionBtn({
  href, onClick, icon: Icon, label, external, color = "slate",
}: {
  href?: string | null; onClick?: () => void; icon: any; label: string; external?: boolean;
  color?: "indigo" | "emerald" | "cyan" | "violet" | "amber" | "rose" | "slate" | "primary";
}) {
  const disabled = href === null && !onClick;
  const colorMap: Record<string, string> = {
    indigo: "border-indigo-200 text-indigo-700 hover:bg-indigo-50",
    emerald: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    cyan: "border-cyan-200 text-cyan-700 hover:bg-cyan-50",
    violet: "border-violet-200 text-violet-700 hover:bg-violet-50",
    amber: "border-amber-200 text-amber-700 hover:bg-amber-50",
    rose: "border-rose-200 text-rose-700 hover:bg-rose-50",
    slate: "border-slate-200 text-slate-700 hover:bg-slate-50",
    primary: "border-transparent text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 shadow-md",
  };
  const cls = `inline-flex items-center gap-1.5 rounded-lg px-3 h-9 text-xs font-semibold border transition-all ${colorMap[color]} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`;
  const inner = (<><Icon className="size-3.5" /><span className="hidden sm:inline">{label}</span></>);
  if (href && !disabled) {
    return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>{inner}</a>;
  }
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{inner}</button>;
}
