import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Inbox,
  Clock,
  UserCheck,
  UserX,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Archive,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getTicketCounts } from "@/lib/crm/tickets.functions";

export type TicketScopeView =
  | "all"
  | "open"
  | "unassigned"
  | "mine"
  | "waiting_customer"
  | "in_progress"
  | "resolved"
  | "closed";

interface Props {
  activeScope: TicketScopeView;
  onSelectScope: (scope: TicketScopeView) => void;
  compact?: boolean;
}

export function SupportSidebar({ activeScope, onSelectScope, compact = false }: Props) {
  const getCountsFn = useServerFn(getTicketCounts);

  const { data: counts } = useQuery({
    queryKey: ["support-ticket-counts"],
    queryFn: () => getCountsFn(),
    refetchInterval: 20_000,
  });

  const views: { id: TicketScopeView; label: string; icon: typeof Inbox; count?: number; color?: string }[] = [
    { id: "all", label: "All Tickets", icon: Inbox, count: counts?.all },
    { id: "open", label: "Open Tickets", icon: AlertCircle, count: counts?.open, color: "text-blue-600" },
    { id: "unassigned", label: "Unassigned", icon: UserX, count: counts?.unassigned, color: "text-amber-600" },
    { id: "mine", label: "Assigned to Me", icon: UserCheck, count: counts?.mine, color: "text-indigo-600" },
    { id: "waiting_customer", label: "Waiting for Customer", icon: Clock, count: counts?.waiting_customer, color: "text-amber-700" },
    { id: "in_progress", label: "In Progress", icon: Sparkles, count: counts?.in_progress, color: "text-purple-600" },
    { id: "resolved", label: "Resolved", icon: CheckCircle2, count: counts?.resolved, color: "text-emerald-600" },
    { id: "closed", label: "Closed", icon: Archive, count: counts?.closed, color: "text-slate-500" },
  ];

  return (
    <nav className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col h-full select-none">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span>Helpdesk</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Views
        </div>
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = activeScope === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelectScope(v.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-900 font-semibold shadow-xs border border-indigo-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600" : v.color || "text-slate-400"}`} />
                <span className="truncate">{v.label}</span>
              </div>

              {v.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {v.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Auto-sync enabled</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </nav>
  );
}
