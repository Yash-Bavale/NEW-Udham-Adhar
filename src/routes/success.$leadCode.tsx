import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Printer,
  History,
  BadgeCheck as BadgeCheckIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  User,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { getCustomerInvoiceUrl } from "@/lib/crm/invoices.functions";
import { trackEvent } from "@/lib/analytics/track";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Start Onboarding" },
      { name: "description", content: "Your payment was received. Complete a quick onboarding to file your application." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
    let cancelled = false;

    (async () => {
      // Poll up to ~30s to give PayU's S2S webhook time to mark the payment paid
      const maxAttempts = 15;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const res = await getSummary({ data: { leadCode } });
          if (cancelled) return;
          const isPaid = !!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status);
          if (isPaid) {
            setData(res);
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          if (cancelled) return;
          setError(err?.message || "Failed to load details");
          setIsLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (cancelled) return;
      // Still no confirmation — show the pending page (NOT the payment page;
      // the user may have actually paid and webhook is just delayed).
      navigate({ to: "/payment-pending/$leadCode", params: { leadCode }, replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-navy font-semibold">Confirming payment…</p>
          <p className="text-xs text-slate-500">This can take a few seconds.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-brand-navy mb-2">Something went wrong</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <Button className="bg-brand-navy" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const lead = data?.lead;
  const payment = lead?.payment;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-slate-50 to-slate-50 pb-20 pt-8 print:bg-white print:pt-0 print:pb-0">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* Success hero */}
        <div className="text-center mb-6 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-in zoom-in duration-500 ring-8 ring-green-50">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy font-display mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            We've received your application fee. Please complete the service-wise information below so processing can begin.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Ref: <span className="font-mono font-semibold text-brand-navy">{leadCode}</span>
          </p>
        </div>

        {/* Action needed card — the PRIMARY focus */}
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 overflow-hidden shadow-xl print:hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-amber-700 mb-0.5">
                  Attention Needed
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-display leading-tight">
                  Fill incomplete information
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              Your payment is confirmed. To start processing, our experts need
              the remaining information and supporting documents for your selected service.
              It takes <strong>under 3 minutes</strong>.
            </p>

            <ul className="space-y-2 mb-6">
              {[
                { icon: User, text: "Service-wise applicant details" },
                { icon: FileText, text: "Required business or registration information" },
                { icon: ShieldCheck, text: "Supporting documents, if required" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <div className="w-7 h-7 rounded-md bg-white border border-amber-200 flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Link to="/onboarding/$leadCode" params={{ leadCode }} className="block">
              <Button className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold h-14 px-10 rounded-full shadow-xl shadow-brand-red/30 group text-base">
                <Sparkles className="w-5 h-5 mr-2" />
                Fill Incomplete Info
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-[11px] text-center text-slate-500 mt-3">
              Skip this and your application can't be filed.
            </p>
          </div>
        </Card>

        {/* What happens after */}
        <div className="mt-8 grid grid-cols-3 gap-3 print:hidden">
          {[
            { step: 1, title: "Onboarding", desc: "Submit details & docs", icon: FileText, active: true },
            { step: 2, title: "Verification", desc: "Expert review & filing", icon: ShieldCheck, active: false },
            { step: 3, title: "Delivery", desc: "Certificate by email", icon: BadgeCheckIcon, active: false },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-3 sm:p-4 rounded-xl border text-center ${
                s.active
                  ? "bg-white border-brand-red/30 shadow-sm ring-2 ring-brand-red/10"
                  : "bg-white/50 border-slate-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                  s.active ? "bg-brand-red text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              <div className={`text-[11px] font-bold ${s.active ? "text-brand-navy" : "text-slate-500"}`}>
                {s.title}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:block">
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Receipt disclosure - secondary */}
        <div className="mt-8 print:hidden">
          <button
            onClick={() => setShowReceipt((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-brand-navy/30 transition-colors text-sm font-semibold text-brand-navy"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              View payment receipt
            </span>
            {showReceipt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detailed receipt (collapsed by default) */}
        {showReceipt && (
          <div className="block mt-4 print:block print:mt-0">
            <Card className="overflow-hidden border-slate-200 shadow-lg print:shadow-none print:border-none">
              <div className="bg-brand-navy text-white p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h2 className="text-base font-bold font-display uppercase tracking-wider mb-0.5">
                      Consultancy Receipt
                    </h2>
                    <p className="text-slate-300 text-xs">
                      Ref: <span className="font-mono text-white">{leadCode}</span>
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-sm">Business Help Services</div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-tight">
                      Govt. Registration Advisory
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</span>
                    <div className="flex">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase text-[10px] font-bold">
                        Paid
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Date</span>
                    <p className="text-xs font-semibold text-brand-navy">
                      {payment?.payment_date
                        ? format(new Date(payment.payment_date), "dd MMM yyyy")
                        : format(new Date(), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Txn ID</span>
                    <p className="text-xs font-mono font-semibold text-brand-navy break-all">
                      {payment?.transaction_id || "TXN-" + leadCode.split("-").pop()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Method</span>
                    <p className="text-xs font-semibold text-brand-navy capitalize">
                      {payment?.gateway_name || "Digital"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3" /> Applicant
                    </h3>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Name</p>
                        <p className="font-semibold text-brand-navy">{lead?.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Email</p>
                        <p className="font-semibold text-brand-navy break-all">{lead?.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Mobile</p>
                        <p className="font-semibold text-brand-navy">+91 {lead?.mobile}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Service
                    </h3>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs h-full">
                      <p className="font-bold text-brand-red">{lead?.service}</p>
                      {lead?.serviceDescription && (
                        <p className="text-[10px] text-slate-600 leading-relaxed italic">
                          {lead.serviceDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Consultancy Base</span>
                      <span className="font-semibold text-brand-navy">
                        ₹{lead?.baseAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">GST (18%)</span>
                      <span className="font-semibold text-brand-navy">
                        ₹{lead?.gstAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="bg-brand-navy/5 p-3 flex justify-between items-center border-t border-slate-200">
                    <span className="font-bold text-brand-navy text-sm">Net Paid</span>
                    <span className="text-lg font-bold text-brand-red font-display">
                      ₹{lead?.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 print:hidden">
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    size="sm"
                    className="border-brand-navy text-brand-navy hover:bg-slate-100 rounded-full"
                  >
                    <Printer className="w-3.5 h-3.5 mr-2" />
                    Print Receipt
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const { url } = await getCustomerInvoiceUrl({ data: { leadCode } });
                        window.open(url, "_blank", "noopener");
                      } catch (e: any) {
                        alert(e?.message ?? "Tax invoice is being generated. Try again in a moment.");
                      }
                    }}
                    size="sm"
                    className="bg-brand-navy text-white hover:bg-brand-navy/90 rounded-full"
                  >
                    <FileText className="w-3.5 h-3.5 mr-2" />
                    Download Tax Invoice
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center print:hidden">
          <p className="text-xs text-slate-500">
            Need help?{" "}
            <Link to="/contact" className="text-brand-navy font-bold hover:underline">
              Contact our experts
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
