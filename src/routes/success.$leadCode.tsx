import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
  ShieldCheck,
  Printer,
  History,
  BadgeCheck as BadgeCheckIcon
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
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
    
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await getSummary({ data: { leadCode } });
        setData(res);
      } catch (err: any) {
        console.error("Error loading summary:", err);
        setError(err.message || "Failed to load receipt details");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [leadCode, getSummary]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-navy font-semibold">Loading receipt...</p>
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
          <Button 
            className="bg-brand-navy"
            onClick={() => window.location.reload()}
          >
            Try Refreshing
          </Button>
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
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-brand-navy font-display mb-2">Payment Successful!</h1>
          <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
            Your consultancy fee has been received. Our team will start processing your application shortly.
          </p>
        </div>

        {/* The Receipt / Summary Card */}
        <Card className="overflow-hidden border-slate-200 shadow-xl print:shadow-none print:border-none animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header / Brand - Visible on print */}
          <div className="bg-brand-navy text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-1">Consultancy Receipt</h2>
                <p className="text-slate-300 text-xs">Application Ref: <span className="font-mono text-white">{leadCode}</span></p>
              </div>
              <div className="text-right sm:text-right hidden sm:block">
                <div className="font-bold text-lg mb-0.5">Business Help Services</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-tight">Govt. Registration Advisory</div>
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
                  {payment?.payment_date ? format(new Date(payment.payment_date), "dd MMM yyyy") : format(new Date(), "dd MMM yyyy")}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Transaction ID</span>
                <p className="text-sm font-mono font-semibold text-brand-navy break-all">
                  {payment?.transaction_id || "TXN-" + leadCode.split('-').pop()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Method</span>
                <p className="text-sm font-semibold text-brand-navy capitalize">
                  {payment?.gateway_name || "Digital Payment"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Customer & Service Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Applicant Info
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                    <p className="text-sm font-semibold text-brand-navy">{lead?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                    <p className="text-sm font-semibold text-brand-navy">{lead?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mobile</p>
                    <p className="text-sm font-semibold text-brand-navy">+91 {lead?.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Service Info
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 h-full">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Service</p>
                    <p className="text-sm font-bold text-brand-red">{lead?.service}</p>
                  </div>
                  {lead?.serviceDescription && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Details</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        {lead.serviceDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Amount Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" />
                Pricing Details
              </h3>
              <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Consultancy Base Amount</span>
                    <span className="font-semibold text-brand-navy">₹{lead?.baseAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="font-semibold text-brand-navy">₹{lead?.gstAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="bg-brand-navy/5 p-4 flex justify-between items-center border-t border-slate-200">
                  <span className="font-bold text-brand-navy">Net Paid Amount</span>
                  <span className="text-xl font-bold text-brand-red font-display">₹{lead?.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="text-center pt-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">This is a valid digital receipt for consultancy services</p>
              <div className="mt-6 flex items-center justify-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-tighter grayscale opacity-50">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI-DSS</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 256-bit Encrypted</span>
              </div>
            </div>
          </div>
        </Card>

        {/* What happens next - Hidden on print */}
        <div className="mt-12 space-y-6 print:hidden">
          <h2 className="text-xl font-bold text-brand-navy font-display flex items-center gap-2">
            <History className="w-5 h-5 text-brand-red" />
            Next Steps in the Process
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { 
                step: 1, 
                title: "Doc Upload", 
                desc: "Complete the onboarding form & upload docs.",
                icon: FileText
              },
              { 
                step: 2, 
                title: "Verification", 
                desc: "Expert review & application filing.",
                icon: ShieldCheck
              },
              { 
                step: 3, 
                title: "Delivery", 
                desc: "Receive your certificate via email.",
                icon: BadgeCheckIcon
              }
            ].map((s) => (
              <div key={s.step} className="bg-white p-5 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-brand-red/30 transition-shadow hover:shadow-md">
                <div className="absolute -right-1 -top-1 text-5xl font-bold text-slate-50 group-hover:text-slate-100 transition-colors">
                  {s.step}
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center mb-3">
                  <s.icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-brand-navy mb-1 text-sm">{s.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Hidden on print */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="w-full sm:w-auto border-brand-navy text-brand-navy hover:bg-slate-100 h-11 px-8 rounded-full font-bold"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>

          <Link 
            to="/onboarding/$leadCode" 
            params={{ leadCode }}
            className="w-full sm:w-auto"
          >
            <Button className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold h-11 px-10 rounded-full shadow-lg shadow-brand-red/20 group">
              Start Onboarding
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center print:hidden">
          <p className="text-xs text-slate-500">
            Need support? <Link to="/contact" className="text-brand-navy font-bold hover:underline">Contact our experts</Link>
          </p>
        </div>

      </div>
    </div>
  );
}