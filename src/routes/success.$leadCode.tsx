import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  Calendar, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Printer,
  History
} from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Receipt & Application Summary" },
      { name: "description", content: "Your payment has been received successfully. View your application summary and download the receipt." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const getSummary = useServerFn(getApplicationSummary);
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["success.summary", leadCode],
    queryFn: () => getSummary({ data: { leadCode } }),
  });

  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
  }, [leadCode]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-navy font-semibold">Loading receipt...</p>
        </div>
      </div>
    );
  }

  const lead = data?.lead;
  const payment = lead?.payment;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8 print:bg-white print:pt-0 print:pb-0">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Success Banner - Hidden on print */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 print:hidden"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-brand-navy font-display mb-2">Payment Successful!</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Your consultancy fee has been received. A confirmation email and tax invoice will be sent to your inbox shortly.
          </p>
        </motion.div>

        {/* The Receipt / Summary Card */}
        <div ref={printRef}>
          <Card className="overflow-hidden border-slate-200 shadow-xl print:shadow-none print:border-none">
            {/* Header / Brand - Visible on print */}
            <div className="bg-brand-navy text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-1">Payment Receipt</h2>
                  <p className="text-slate-300 text-sm">Application ID: <span className="font-mono text-white">{leadCode}</span></p>
                </div>
                <div className="text-right sm:text-right hidden sm:block">
                  <div className="font-bold text-lg mb-0.5">Business Help Services</div>
                  <div className="text-xs text-slate-300">Consultancy & Assistance Services</div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Payment Details Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  <p className="text-sm font-semibold text-brand-navy">
                    {payment?.payment_date ? format(new Date(payment.payment_date), "dd MMM yyyy, hh:mm a") : format(new Date(), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Transaction ID</span>
                  <p className="text-sm font-mono font-semibold text-brand-navy break-all">
                    {payment?.transaction_id || "TXN-" + leadCode.split('-').pop()}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Payment Method</span>
                  <p className="text-sm font-semibold text-brand-navy capitalize">
                    {payment?.gateway_name || "Online Payment"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Customer & Service Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-red" />
                    Customer Details
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><User className="w-3.5 h-3.5 text-slate-400" /></div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Name</p>
                        <p className="text-sm font-semibold text-brand-navy">{lead?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Mail className="w-3.5 h-3.5 text-slate-400" /></div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Email</p>
                        <p className="text-sm font-semibold text-brand-navy">{lead?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Phone className="w-3.5 h-3.5 text-slate-400" /></div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Mobile</p>
                        <p className="text-sm font-semibold text-brand-navy">{lead?.mobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-red" />
                    Service Details
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Service Selected</p>
                      <p className="text-sm font-bold text-brand-red">{lead?.service}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Description</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        {lead?.serviceDescription || "Professional assistance and consultancy for government portal registration and filing."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amount Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-red" />
                  Financial Summary
                </h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Consultancy Fee (Base)</span>
                      <span className="font-semibold">₹{lead?.baseAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">GST (18%)</span>
                      <span className="font-semibold">₹{lead?.gstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="bg-slate-200/50 p-4 flex justify-between items-center">
                    <span className="font-bold text-brand-navy">Total Amount Paid</span>
                    <span className="text-xl font-bold text-brand-red font-display">₹{lead?.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center pt-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">This is a computer generated receipt</p>
                <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 grayscale opacity-70">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI DSS Compliant</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> ISO Certified</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* What happens next - Hidden on print */}
        <div className="mt-12 space-y-6 print:hidden">
          <h2 className="text-xl font-bold text-brand-navy font-display flex items-center gap-2">
            <History className="w-5 h-5 text-brand-red" />
            What Happens Next?
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { 
                step: 1, 
                title: "Doc Upload", 
                desc: "Upload required documents for the service.",
                icon: FileText
              },
              { 
                step: 2, 
                title: "Verification", 
                desc: "Our experts verify and prepare your application.",
                icon: ShieldCheck
              },
              { 
                step: 3, 
                title: "Processing", 
                desc: "Final certificate delivered to your email.",
                icon: BadgeCheck
              }
            ].map((s) => (
              <div key={s.step} className="bg-white p-5 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-brand-red/30 transition-colors">
                <div className="absolute -right-2 -top-2 text-6xl font-bold text-slate-50 opacity-[0.05] group-hover:text-brand-red/10 transition-colors">
                  {s.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-brand-navy mb-1">{s.step}. {s.title}</h4>
                <p className="text-xs text-slate-500 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Hidden on print */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="w-full sm:w-auto border-brand-navy text-brand-navy hover:bg-slate-100 h-12 px-8 rounded-full"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>

          <Link 
            to="/onboarding/$leadCode" 
            params={{ leadCode }}
            className="w-full sm:w-auto"
          >
            <Button className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold h-12 px-10 rounded-full shadow-lg shadow-brand-red/20 group">
              Start Onboarding
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center print:hidden">
          <p className="text-sm text-slate-500">
            Need help? <Link to="/contact" className="text-brand-navy font-bold hover:underline">Contact our support team</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

function BadgeCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}