import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  FileText,
  Receipt,
  BadgeCheck,
  Info,
  Loader2,
  X,
} from "lucide-react";
import {
  getApplicationSummary,
  updateLeadContact,
} from "@/lib/payments/gateways.functions";
import { initiatePayment, type InitiatePaymentResult } from "@/lib/payments/initiate.functions";
import { trackEvent } from "@/lib/analytics/track";
import payuLogo from "@/assets/gateways/payu.svg";
import razorpayLogo from "@/assets/gateways/razorpay.svg";
import cashfreeLogo from "@/assets/gateways/cashfree.png";


export const Route = createFileRoute("/apply/$leadCode/summary")({
  head: () => ({
    meta: [
      { title: "Pay Application Fee — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SummaryPage,
});

// Service blurbs — shown so the user sees value in what they're paying for.
const SERVICE_INFO: Record<string, { tagline: string; bullets: string[] }> = {
  default: {
    tagline: "Government-compliant filing handled end-to-end by our experts.",
    bullets: [
      "Application prepared & filed by certified consultants",
      "Real-time Email updates on every step",
      "Additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "New Business Help Services": {
    tagline: "Get guided assistance for your new Udyam registration application.",
    bullets: [
      "Application prepared & filed by certified consultants",
      "Real-time Email updates on every step",
      "Basic Aadhaar, PAN, business details, and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "New Udyam Registration": {
    tagline: "Get guided assistance for your new Udyam registration application.",
    bullets: [
      "Application prepared & filed by certified consultants",
      "Real-time Email updates on every step",
      "Basic Aadhaar, PAN, business details, and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Update Udyam Certificate": {
    tagline: "Amend your Udyam / MSME details on the official portal — fast.",
    bullets: [
      "Update name, address, NIC, bank, mobile, email & investment data",
      "Real-time Email updates on every step",
      "Current Udyam registered mobile number/email ID and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Udyam Registration Certificate Download": {
    tagline: "Get guided assistance to download your existing Udyam certificate.",
    bullets: [
      "Certificate download support by trained consultants",
      "Real-time Email updates on every step",
      "Current Udyam registered mobile number/email ID and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Udyog Aadhaar to Udyam Migration": {
    tagline: "Move your old Udyog Aadhaar details into the current Udyam process.",
    bullets: [
      "Migration support handled by certified consultants",
      "Real-time Email updates on every step",
      "Current Udyog registered mobile number/email ID and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Forgot Registered Mobile / Email": {
    tagline: "Assistance for recovering or updating inaccessible registered contact details.",
    bullets: [
      "Application and complaint documentation support",
      "Real-time Email updates on every step",
      "Current Udyam applicant PAN Card, Aadhaar Card, and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Correct PAN / Aadhaar Name in Udyam": {
    tagline: "Guided correction support for PAN/Aadhaar name mismatch in Udyam records.",
    bullets: [
      "Correction request reviewed by certified consultants",
      "Real-time Email updates on every step",
      "Current Udyam details, Aadhaar, PAN, business details, and additional documents or information may be required depending upon processing requirements.",
    ],
  },
  "Talk to Expert – Suitable Service Selection": {
    tagline: "Get guided consultation before choosing the right service.",
    bullets: [
      "Requirement reviewed by an expert consultant",
      "Real-time Email updates on every step",
      "Basic consultation service intended to help identify suitable service requirements.",
    ],
  },
  "Expert Consultation": {
    tagline: "Get guided consultation before choosing the right service.",
    bullets: [
      "Requirement reviewed by an expert consultant",
      "Real-time Email updates on every step",
      "Basic consultation service intended to help identify suitable service requirements.",
    ],
  },
};

// Gateway brand colors — used to render a logo-style pill.
const GATEWAY_BRAND: Record<
  string,
  { bg: string; fg: string; label: string; tag?: string; logo?: string }
> = {
  payu:     { bg: "#1FB266", fg: "#ffffff", label: "PayU",     logo: payuLogo,     tag: "UPI · Cards · Net Banking · Wallets" },
  razorpay: { bg: "#072654", fg: "#ffffff", label: "Razorpay", logo: razorpayLogo, tag: "UPI · Cards · Net Banking" },
  cashfree: { bg: "#6933FF", fg: "#ffffff", label: "Cashfree", logo: cashfreeLogo, tag: "UPI · Cards" },
  phonepe:  { bg: "#5F259F", fg: "#ffffff", label: "PhonePe",  tag: "UPI · Wallet" },
  ccavenue: { bg: "#E11D48", fg: "#ffffff", label: "CCAvenue", tag: "Cards · Net Banking" },
};



function SummaryPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);
  const updateContact = useServerFn(updateLeadContact);
  const createOrder = useServerFn(initiatePayment);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["apply.summary", leadCode],
    queryFn: () => getSummary({ data: { leadCode } }),
  });

  const [chosen, setChosen] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [order, setOrder] = useState<InitiatePaymentResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    trackEvent("summary_viewed", { leadCode });
  }, [leadCode]);

  // Auto-submit the hidden form once we have order fields → no extra page.
  useEffect(() => {
    if (order && formRef.current) formRef.current.submit();
  }, [order]);

  const lead = data?.lead;
  const gateways = data?.gateways ?? [];

  useEffect(() => {
    if (lead?.payment || ["payment_successful", "under_process", "completed"].includes(lead?.status)) {
      navigate({ to: "/success/$leadCode", params: { leadCode }, replace: true });
    }
  }, [lead?.payment, lead?.status, leadCode, navigate]);

  const activeGateway = useMemo(() => {
    if (chosen) return chosen;
    const payu = gateways.find((g) => g.name === "payu");
    return payu?.name ?? gateways[0]?.name ?? null;
  }, [chosen, gateways]);

  const info = lead
    ? SERVICE_INFO[lead.service] ?? SERVICE_INFO.default
    : SERVICE_INFO.default;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
        Loading your application…
      </div>
    );
  }
  if (error || !lead) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Could not load your application."}
        </div>
      </div>
    );
  }

  const canPay = activeGateway === "payu" && !payBusy && !order;

  async function handlePay() {
    if (!canPay) return;
    setPayBusy(true);
    setPayError(null);
    trackEvent("payment_initiated", { gateway: "payu", leadCode });
    try {
      const res = await createOrder({ data: { leadCode } });
      setOrder(res);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Could not start payment.");
      setPayBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-6 md:py-10">


      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="bg-form-header text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold font-display">Pay Application Fee</h1>
            <p className="text-xs text-white/80">Ref: {lead.leadCode}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Lock className="w-3.5 h-3.5" /> 256-bit SSL
          </div>
        </div>

        <div className="p-5 md:p-7 space-y-6">
          {/* Service info banner */}
          <div className="rounded-xl border border-brand-navy/15 bg-brand-navy/5 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-brand-navy/70 font-semibold">
                  Service Selected
                </div>
                <div className="text-base font-bold font-display text-foreground">
                  {lead.service}
                </div>
                <p className="text-[13px] text-foreground/80 mt-0.5">{info.tagline}</p>
                <ul className="mt-2 space-y-1">
                  {info.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-[12.5px] text-foreground/85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact card — view/edit */}
          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-navy" /> Your details
              </div>
              {!editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setEditError(null);
                  }}
                  className="text-xs font-semibold text-brand-navy inline-flex items-center gap-1 hover:underline"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!editing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3"
                >
                  <Field label="Applicant" value={lead.name} />
                  <Field label="Mobile" value={`+91 ${lead.mobile}`} />
                  <Field label="Email" value={lead.email} className="col-span-2" />
                </motion.div>
              ) : (
                <motion.form
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const payload = {
                      leadCode,
                      name: String(fd.get("name") ?? "").trim(),
                      email: String(fd.get("email") ?? "").trim(),
                      mobile: String(fd.get("mobile") ?? "").trim(),
                    };
                    setSavingEdit(true);
                    setEditError(null);
                    try {
                      await updateContact({ data: payload });
                      await refetch();
                      setEditing(false);
                    } catch (err) {
                      setEditError(err instanceof Error ? err.message : "Could not save.");
                    } finally {
                      setSavingEdit(false);
                    }
                  }}
                  className="px-4 py-4 space-y-3"
                >
                  <Input2 label="Full name" name="name" defaultValue={lead.name} />
                  <Input2 label="Email" name="email" type="email" defaultValue={lead.email} />
                  <Input2
                    label="Mobile (10-digit)"
                    name="mobile"
                    inputMode="numeric"
                    maxLength={10}
                    defaultValue={lead.mobile}
                  />
                  {editError && (
                    <p className="text-xs text-red-600">{editError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  >
                    {savingEdit ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                      </>
                    ) : (
                      "Save details"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Tax / invoice breakdown */}
          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border text-sm font-semibold">
              <Receipt className="w-4 h-4 text-brand-navy" /> Tax invoice preview
            </div>
            <div className="p-4 space-y-2 text-sm">
              <Row label="Service charges" value={`₹${lead.baseAmount.toFixed(2)}`} />
              <Row
                label="GST @ 18% (CGST 9% + SGST 9%)"
                value={`₹${lead.gstAmount.toFixed(2)}`}
              />
              <div className="border-t border-dashed border-border my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total payable</span>
                <span className="text-2xl font-bold text-brand-navy">
                  ₹{lead.totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-1">
                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                GST invoice (GSTIN-tagged) will be emailed to you instantly after payment.
              </p>
            </div>
          </div>

          {/* Payment gateways */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-navy" /> Choose payment method
            </h2>
            <div className="space-y-2">
              {gateways.map((g) => {
                const brand = GATEWAY_BRAND[g.name] ?? {
                  bg: "#1f2937",
                  fg: "#fff",
                  label: g.display_name,
                };
                const supported = g.name === "payu";
                const selected = activeGateway === g.name;
                return (
                  <label
                    key={g.name}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all ${
                      selected
                        ? "border-brand-navy bg-brand-navy/5 ring-2 ring-brand-navy/20"
                        : "border-border bg-background"
                    } ${supported ? "cursor-pointer hover:border-brand-navy/50" : "opacity-60 cursor-not-allowed"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="gateway"
                        value={g.name}
                        checked={selected}
                        disabled={!supported}
                        onChange={() => supported && setChosen(g.name)}
                        className="accent-brand-navy"
                      />
                      <GatewayLogo brand={brand} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground leading-tight">
                          {g.display_name}
                        </div>
                        {brand.tag && (
                          <div className="text-[11px] text-muted-foreground leading-tight">
                            {brand.tag}
                          </div>
                        )}
                      </div>
                    </div>
                    {supported ? (
                      <span className="text-[10px] uppercase font-bold tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </label>
                );
              })}
              {gateways.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No payment methods are enabled. Please contact support.
                </p>
              )}
            </div>
          </div>

          {payError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {payError}
            </div>
          )}

          {/* Pay button */}
          <motion.button
            type="button"
            onClick={handlePay}
            disabled={!canPay}
            whileTap={canPay ? { scale: 0.98 } : undefined}
            className={`block w-full text-center rounded-full font-bold py-4 text-base transition-all shadow-lg ${
              canPay
                ? "bg-gradient-to-r from-brand-navy via-brand-navy-deep to-brand-navy text-white hover:shadow-xl hover:brightness-110"
                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            }`}
          >
            {order || payBusy ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening secure payment…
              </span>
            ) : (
              <>Pay Now ₹{lead.totalAmount.toFixed(2)} securely →</>
            )}
          </motion.button>

          <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
            By clicking “Pay Now” you confirm that you have read and agreed to our{" "}
            <Link to="/terms-conditions" className="font-semibold text-brand-navy underline">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link to="/refund-cancellation-policy" className="font-semibold text-brand-navy underline">
              Refund &amp; Cancellation Policy
            </Link>
            , and acknowledge that this website provides private consultancy and assistance services. Service initiation shall take place only after confirmation through email or other written communication. Please review all submitted details carefully before proceeding with payment.
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> PCI-DSS Secure
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Refund Policy
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" /> Govt-compliant filing
            </span>
          </div>

        </div>
      </motion.div>

      {/* Hidden auto-submit form posting straight to PayU */}
      {order && (
        <form ref={formRef} method="POST" action={order.actionUrl} className="hidden">
          {Object.entries(order.fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}
    </section>
  );
}


function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="text-[13.5px] font-medium text-foreground break-all">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/85">
      <span>{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

function Input2(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </span>
      <input
        {...rest}
        required
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
      />
    </label>
  );
}

function GatewayLogo({
  brand,
}: {
  brand: { bg: string; fg: string; label: string; logo?: string };
}) {
  if (brand.logo) {
    return (
      <div className="w-16 h-9 rounded-md bg-white border border-border flex items-center justify-center p-1 shadow-sm">
        <img src={brand.logo} alt={`${brand.label} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className="w-16 h-9 rounded-md flex items-center justify-center text-[11px] font-extrabold tracking-tight shadow-sm"
      style={{ backgroundColor: brand.bg, color: brand.fg }}
    >
      {brand.label}
    </div>
  );
}

