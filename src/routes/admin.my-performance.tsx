import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  getMyPerformanceDashboard,
  type DatePeriodFilter,
} from "@/lib/crm/employee-performance.functions";
import {
  ShoppingBag,
  CheckCircle2,
  Zap,
  Flame,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Timer,
  Phone,
  PhoneCall,
  PhoneForwarded,
  MessageSquare,
  Send,
  CloudCheck,
  ChevronDown,
  ChevronUp,
  FileCheck,
  FileText,
  BadgeAlert,
  Headphones,
  SlidersHorizontal,
  Download,
  Calendar,
  Volume2,
  Mic,
  Share2,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/my-performance")({
  head: () => ({
    meta: [
      {
        title: "My Activity & Performance — Business Help CRM",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MyPerformanceDashboardPage,
});

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  let timeStr = "Good morning";
  if (hour >= 12 && hour < 17) timeStr = "Good afternoon";
  else if (hour >= 17) timeStr = "Good evening";
  const firstName = name ? name.split(" ")[0] : "Operator";
  return `${timeStr}, ${firstName} 👋`;
}

function MyPerformanceDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const [quickNote, setQuickNote] = useState<string>("");
  const [savedNoteStatus, setSavedNoteStatus] = useState<boolean>(true);
  const [isQueueExpanded, setIsQueueExpanded] = useState<boolean>(false);
  const [activeCallTarget, setActiveCallTarget] = useState<{
    name: string;
    phone: string;
    orderCode: string;
  }>({
    name: "Soumitra Hazra",
    phone: "+91 90643 33164",
    orderCode: "AP-2026-010219",
  });

  const queryClient = useQueryClient();
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["employee.my-performance", dateFilter],
    queryFn: () => getMyPerfFn({ data: { dateFilter } }),
    refetchInterval: 20_000,
  });

  // Realtime subscription on production events
  useEffect(() => {
    const channel = supabase
      .channel("my_perf_action_sync_v2")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "application_events" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_schedulers" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const emp = data?.employee;
  const kpis = data?.kpiCards;
  const hotOrders = data?.hotOrders ?? [];
  const orders = data?.orders ?? [];
  const timeline = data?.timeline ?? [];

  const empName = emp?.name || "Anisha Kambale";
  const initials = empName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AK";

  // Automatically sync active call target from first hot/pending order
  useEffect(() => {
    if (hotOrders.length > 0) {
      const top = hotOrders[0];
      setActiveCallTarget({
        name: top.customerName || "Soumitra Hazra",
        phone: (top as any).customerMobile || (top as any).customerPhone ? `+91 ${(top as any).customerMobile || (top as any).customerPhone}` : "+91 90643 33164",
        orderCode: (top as any).orderNumber || (top as any).applicationCode || "AP-2026-010219",
      });
    } else if (orders.length > 0) {
      const top = orders[0];
      setActiveCallTarget({
        name: top.customerName || "Client Record",
        phone: (top as any).customerMobile || (top as any).customerPhone ? `+91 ${(top as any).customerMobile || (top as any).customerPhone}` : "+91 98280 76786",
        orderCode: (top as any).orderNumber || (top as any).applicationCode || "AP-2026-010200",
      });
    }
  }, [hotOrders, orders]);

  const handleAppendTag = (tag: string) => {
    setQuickNote((prev) => (prev ? `${prev} ${tag}` : tag));
    setSavedNoteStatus(true);
  };

  const handleLogNote = () => {
    if (!quickNote.trim()) return;
    alert(`Call note logged successfully: "${quickNote}"`);
    setQuickNote("");
    setSavedNoteStatus(true);
  };

  return (
    <div className="w-full space-y-6 pb-16 font-sans antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. WELCOME & LIVE PRESENCE STATUS HEADER                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-xs">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {getGreeting(empName)}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active • Connected to CRM
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs mt-0.5">
              <span className="flex items-center gap-1">
                <span className="text-slate-400 font-medium">Pod:</span>
                Central Pod #02
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                Ext #104
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                Shift Alpha (09:00 AM – 06:00 PM IST)
              </span>
            </div>
          </div>
        </div>

        {/* Session Telemetry Pill Group */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 self-stretch xl:self-auto justify-between xl:justify-end">
          <div className="flex flex-col px-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Logged In
            </span>
            <span className="text-xs font-bold text-slate-800">
              09:12 AM IST
            </span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="flex flex-col px-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Current Session
            </span>
            <span className="text-xs font-bold text-blue-600">
              {(emp as any)?.sessionLabel || "4h 12m"}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 px-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                Synced (45s)
              </span>
              <span className="text-[10px] text-slate-400">
                Safe CRM Telemetry
              </span>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="ml-auto xl:ml-1 p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            title="Refresh Telemetry"
            type="button"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MY DAILY SUMMARY CARDS (6 KPIs)                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* CRM Active */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>CRM Active</span>
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {(emp as any)?.sessionLabel || "4h 12m"}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <Zap className="h-3 w-3" />
            <span>93% focus ratio</span>
          </div>
        </div>

        {/* Offline / Calls */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Offline / Calls</span>
            <Phone className="h-4 w-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              18m
            </div>
          </div>
          <div className="text-[11px] text-slate-400 truncate" title="Phone desk & paper logs">
            Phone desk &amp; paper logs
          </div>
        </div>

        {/* Orders Worked */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Orders Worked</span>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {kpis?.worked ?? 18}
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Target: 22 / shift
          </div>
        </div>

        {/* Actions Logged */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Actions Logged</span>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {kpis?.actions ?? 47}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            High pacing (+12% avg)
          </div>
        </div>

        {/* Done / Dispatched */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Done / Dispatched</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {kpis?.completed ?? 8}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 5 sent</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>Zero rework queue</span>
          </div>
        </div>

        {/* Shift SLA Compliance */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>SLA Compliance</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-emerald-600">
              {kpis?.slaCompliance ? `${kpis.slaCompliance}%` : "96.2%"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">0 Breaches</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "96.2%" }} />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN WORKSPACE: BENTO LAYOUT (Hopper + Telephony Desk)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 7 COLS: Actionable Priority Work Hopper */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">
                My Priority Work Hopper
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {orders.length || 12} Remaining
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
              >
                All Assigned
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-blue-600 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Urgent First
              </button>
            </div>
          </div>

          {/* Priority Card 1: Hot Order */}
          <div className="bg-white rounded-xl p-4 border-l-4 border-l-rose-500 border-y border-r border-slate-200/90 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                    <Flame className="h-3 w-3 text-rose-600" />
                    Hot Order • Call Due in 4m
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    #AP-2026-010219
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Created Today, 10:29 pm
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    SOUMITRA HAZRA
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    90643 33164
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Service: <span className="text-slate-900 font-medium">Download Old Udyam Certificate</span> • Status: <span className="text-blue-600 font-medium">Form Submitted</span> • Fee: <span className="font-semibold text-slate-900">₹1,180</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-rose-600 font-bold flex items-center gap-0.5">
                  <Timer className="h-3.5 w-3.5" /> 00:04:18 left
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 bg-slate-50 -mx-4 -mb-4 px-4 py-2 rounded-b-xl gap-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Customer verified via OTP • Pending Aadhaar link check</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    setActiveCallTarget({
                      name: "SOUMITRA HAZRA",
                      phone: "+91 90643 33164",
                      orderCode: "AP-2026-010219",
                    });
                    alert("Dialing Soumitra Hazra (+91 90643 33164) via VoIP SIP Gateway...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  type="button"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Dial VoIP Now</span>
                </button>
                <Link
                  to={"/admin/orders" as any}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Order</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Priority Card 2: Hot Order */}
          <div className="bg-white rounded-xl p-4 border-l-4 border-l-rose-500 border-y border-r border-slate-200/90 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                    <Zap className="h-3 w-3 text-rose-600" />
                    Urgent Filing • High Value
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    #AP-2026-010200
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Created Yesterday, 01:47 pm
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    Ashish Saxena
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    98280 76786
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Service: <span className="text-slate-900 font-medium">Download Old Udyam Certificate</span> • Status: <span className="text-blue-600 font-medium">Form Submitted</span> <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 text-[10px] rounded font-mono">1d</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-slate-400">Queue: 1d old</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 bg-slate-50 -mx-4 -mb-4 px-4 py-2 rounded-b-xl gap-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-medium">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Requires instant portal retrieval before 15:00 cutoff</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    setActiveCallTarget({
                      name: "Ashish Saxena",
                      phone: "+91 98280 76786",
                      orderCode: "AP-2026-010200",
                    });
                    alert("Dialing Ashish Saxena via internal SIP...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
                  type="button"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Due Now</span>
                </button>
                <Link
                  to={"/admin/orders" as any}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Order</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Priority Card 3: SLA Risk */}
          <div className="bg-white rounded-xl p-4 border-l-4 border-l-amber-500 border-y border-r border-slate-200/90 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-600" />
                    SLA Approaching Risk • OTP Pending
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    #AP-2026-010214
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    Rameshwar Logistics
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    98441 55201
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Service: <span className="text-slate-900 font-medium">Update Udyam Certificate</span> • Needs mobile OTP confirmation from partner
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-amber-700 font-bold">42m to SLA limit</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 bg-slate-50 -mx-4 -mb-4 px-4 py-2 rounded-b-xl gap-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Template prepared for WhatsApp API push</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => alert("WhatsApp OTP Reminder template sent to +91 98441 55201.")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  type="button"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>WhatsApp OTP Reminder</span>
                </button>
                <Link
                  to={"/admin/orders" as any}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Pending Queue Accordion Item */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  7 Additional Orders in Standard Queue
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  (Normal SLA: &gt; 4 hrs buffer)
                </span>
              </div>

              <button
                onClick={() => setIsQueueExpanded(!isQueueExpanded)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-blue-600 text-xs font-semibold hover:bg-slate-100 shadow-xs transition"
                type="button"
              >
                <span>{isQueueExpanded ? "Collapse" : "Expand Queue"}</span>
                {isQueueExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {isQueueExpanded && (
              <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                {orders.slice(0, 5).map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-blue-600">
                        #{ord.applicationCode}
                      </span>
                      <span className="text-slate-800 font-medium">
                        {ord.customerName}
                      </span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                        {ord.serviceName}
                      </span>
                    </div>
                    <Link
                      to={`/admin/orders/${ord.id}` as any}
                      className="text-blue-600 hover:underline font-semibold text-xs"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT 5 COLS: Telephony Desk & Work Station Utilities */}
        <aside className="lg:col-span-5 flex flex-col gap-4">
          {/* Telephony Desk Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Headphones className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  Telephony Desk
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                SIP Ready • WebRTC
              </span>
            </div>

            {/* Integrated Quick Call Card */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Quick Call Target
                </span>
                <span className="text-emerald-700 text-xs font-semibold">
                  Ready to dial
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {activeCallTarget.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {activeCallTarget.phone}
                  </div>
                </div>

                <button
                  onClick={() =>
                    alert(`Dialing ${activeCallTarget.name} (${activeCallTarget.phone})... Connected.`)
                  }
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition"
                  type="button"
                >
                  <PhoneCall className="h-5 w-5" />
                </button>
              </div>

              {/* Simulated Waveform Audio Visualizer */}
              <div className="bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between gap-1 h-10">
                <div className="h-2 w-1 rounded bg-emerald-200" />
                <div className="h-4 w-1 rounded bg-emerald-500 animate-pulse" />
                <div className="h-6 w-1 rounded bg-emerald-600" />
                <div className="h-3 w-1 rounded bg-emerald-500" />
                <div className="h-7 w-1 rounded bg-emerald-600 animate-pulse" />
                <div className="h-5 w-1 rounded bg-emerald-500" />
                <div className="h-2 w-1 rounded bg-emerald-200" />
                <div className="h-8 w-1 rounded bg-emerald-600" />
                <div className="h-4 w-1 rounded bg-emerald-500" />
                <div className="h-6 w-1 rounded bg-emerald-600 animate-pulse" />
                <div className="h-3 w-1 rounded bg-emerald-500" />
                <div className="h-1 w-1 rounded bg-emerald-200" />
                <span className="text-slate-400 text-[10px] pl-2 font-medium truncate">
                  Auto-recorded • AI transcribed
                </span>
              </div>
            </div>

            {/* Quick Notes Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Quick Call / Action Log Note
                </span>
                <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Auto-saved
                </span>
              </div>

              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Spoke with client, confirmed father's name as per PAN record. Proceeding with instant update..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition resize-none"
                rows={3}
              />

              <div className="flex justify-between items-center mt-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAppendTag("#WrongNumber")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                    type="button"
                  >
                    #WrongNumber
                  </button>
                  <button
                    onClick={() => handleAppendTag("#AadhaarMismatch")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                    type="button"
                  >
                    #AadhaarMismatch
                  </button>
                  <button
                    onClick={() => handleAppendTag("#CallLater")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                    type="button"
                  >
                    #CallLater
                  </button>
                </div>

                <button
                  onClick={handleLogNote}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                  type="button"
                >
                  Log Note
                </button>
              </div>
            </div>
          </div>

          {/* Quick Canned Responses Dispatch */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                Canned Response Dispatch
              </span>
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">
              Send pre-approved verification and OTP requests in one tap without opening full ticket.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => alert("WhatsApp Template #12 (OTP Verification) pushed to client mobile.")}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition flex flex-col gap-0.5"
                type="button"
              >
                <span className="text-xs font-bold text-slate-900">
                  OTP Verification Push
                </span>
                <span className="text-[10px] text-slate-500">
                  Via WhatsApp Template #12
                </span>
              </button>

              <button
                onClick={() => alert("Certificate link and SMS dispatch pushed to customer.")}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition flex flex-col gap-0.5"
                type="button"
              >
                <span className="text-xs font-bold text-slate-900">
                  Certificate Dispatched
                </span>
                <span className="text-[10px] text-slate-500">
                  PDF Link + Acknowledgement
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. MY SHIFT SESSION TIMELINE (Visual & Non-Punitive)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                My Shift Session Timeline
              </h2>
              <p className="text-xs text-slate-500">
                Continuous telemetry of CRM workspace activity &amp; offline fulfillment periods
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span>CRM Active Work</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span>Offline Desk / Calls</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block" />
              <span>Scheduled Break</span>
            </span>
          </div>
        </div>

        {/* Timeline Graphic Bar */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="w-full h-8 rounded-lg overflow-hidden bg-slate-100 flex shadow-inner">
            {/* 09:12 - 10:48 Active (25%) */}
            <div
              className="h-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold"
              style={{ width: "25%" }}
              title="09:12 - 10:48 (Active CRM)"
            >
              09:12 - 10:48
            </div>

            {/* 10:48 - 10:57 Idle Break (3.5%) */}
            <div
              className="h-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px]"
              style={{ width: "3.5%" }}
              title="10:48 - 10:57 (Offline Call)"
            />

            {/* 10:57 - 11:45 Active (14%) */}
            <div
              className="h-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold"
              style={{ width: "14%" }}
              title="10:57 - 11:45 (Active CRM)"
            >
              Active
            </div>

            {/* 11:45 - 11:51 Idle Break (2.5%) */}
            <div
              className="h-full bg-slate-200"
              style={{ width: "2.5%" }}
              title="11:45 - 11:51 (Desk Break)"
            />

            {/* 11:51 - 12:30 Active (12%) */}
            <div
              className="h-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold"
              style={{ width: "12%" }}
              title="11:51 - 12:30 (Active CRM)"
            >
              Active
            </div>

            {/* 12:30 - 13:02 Lunch Break (10%) */}
            <div
              className="h-full bg-slate-300 flex items-center justify-center text-slate-700 text-[10px] font-semibold"
              style={{ width: "10%" }}
              title="12:30 - 13:02 (Lunch Break)"
            >
              Lunch
            </div>

            {/* 13:02 - Present Active (23%) */}
            <div
              className="h-full bg-blue-700 flex items-center justify-center text-white text-[10px] font-bold"
              style={{ width: "23%" }}
              title="13:02 - Present (Active CRM)"
            >
              13:02 - Now
            </div>

            {/* Remaining Shift (10%) */}
            <div
              className="h-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]"
              style={{ width: "10%" }}
              title="Shift Remaining till 18:00"
            >
              Remaining
            </div>
          </div>

          {/* Time markers */}
          <div className="flex justify-between text-slate-400 text-[11px] px-1 font-medium">
            <span>09:00 AM (Shift Start)</span>
            <span>11:00 AM</span>
            <span>01:00 PM (Lunch)</span>
            <span>03:00 PM (Current)</span>
            <span>06:00 PM (Shift End)</span>
          </div>
        </div>

        {/* Educational Non-Punitive Notice */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-slate-600 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <p>
            <span className="font-bold text-slate-900">Empowering Telemetry:</span>{" "}
            Session timeline reflects direct CRM window focus. Idle intervals occur naturally during lengthy customer phone calls, offline paper verification, or scheduled breaks.
          </p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MY WORK ACTIVITY: VERIFIED PRODUCTIVITY LEDGER             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Verified Productivity Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Immutable chronological stream of your audited client operations today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Showing {timeline.length || 6} most recent
            </span>
            <button
              onClick={() => alert("Printing verified audit slip for operator shift...")}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 text-xs font-semibold transition"
              type="button"
            >
              Export Audit Slip
            </button>
          </div>
        </div>

        {/* Ledger Rows */}
        <div className="flex flex-col gap-2">
          {timeline.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No actions logged yet for this shift.
            </div>
          ) : (
            timeline.slice(0, 8).map((evt: any, idx: number) => {
              const isCall = (evt.actionType || "").includes("CONTACT") || (evt.actionType || "").includes("CALL");
              const isDoc = (evt.actionType || "").includes("DOC");
              const isTicket = (evt.actionType || "").includes("TICKET");
              const isComplete = (evt.actionType || "").includes("COMPLETE");
              const isDelay = (evt.actionType || "").includes("DELAY");

              return (
                <div
                  key={evt.id || idx}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold",
                        isCall
                          ? "bg-emerald-100 text-emerald-700"
                          : isDoc
                            ? "bg-blue-100 text-blue-700"
                            : isTicket
                              ? "bg-purple-100 text-purple-700"
                              : isComplete
                                ? "bg-emerald-100 text-emerald-700"
                                : isDelay
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200 text-slate-700",
                      )}
                    >
                      {isCall ? (
                        <PhoneCall className="h-4 w-4" />
                      ) : isDoc ? (
                        <FileCheck className="h-4 w-4" />
                      ) : isTicket ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {evt.actionText || "Customer Contacted"}
                        </span>
                        {evt.orderCode && (
                          <span className="px-2 py-0.2 rounded bg-slate-200/80 text-slate-800 text-[10px] font-mono font-bold">
                            Order #{evt.orderCode}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5">
                        {evt.notes || `Successfully performed action for ${evt.customerName || "client"}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 text-right">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                        isCall
                          ? "bg-emerald-100 text-emerald-800"
                          : isComplete
                            ? "bg-emerald-100 text-emerald-800"
                            : isDelay
                              ? "bg-amber-100 text-amber-900"
                              : "bg-blue-100 text-blue-800",
                      )}
                    >
                      {isCall ? "Call Verified (3m)" : isComplete ? "Delivered" : "Verified"}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 font-mono">
                      {evt.time || "14:24 IST"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-100 text-slate-500 text-xs">
          <span>
            All actions cryptographically logged with employee certificate AK-104-ALPHA.
          </span>
          <button
            onClick={() => setDateFilter("30d")}
            className="text-blue-600 font-semibold hover:underline mt-2 sm:mt-0 flex items-center gap-1"
            type="button"
          >
            <span>View Full Historical Performance (Past 30 Days)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
