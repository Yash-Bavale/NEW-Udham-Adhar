import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Users, FileText, LayoutDashboard, Briefcase, UserCog, Receipt, MessageSquareWarning,
  Award, Mail, Activity, ShieldCheck, CreditCard, Settings,
} from "lucide-react";
import { globalSearch, type SearchHit } from "@/lib/crm/global-search.functions";

const QUICK_NAV: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; group: string; shortcut?: string }[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Go to", shortcut: "g d" },
  { to: "/admin/customers", label: "Customers", icon: Users, group: "Go to", shortcut: "g c" },
  { to: "/admin/leads", label: "Leads", icon: Users, group: "Go to", shortcut: "g l" },
  { to: "/admin/applications", label: "Applications", icon: FileText, group: "Go to", shortcut: "g a" },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning, group: "Go to" },
  { to: "/admin/certificates", label: "Certificates", icon: Award, group: "Go to" },
  { to: "/admin/services", label: "Services", icon: Briefcase, group: "Go to" },
  { to: "/admin/gateways", label: "Payment Gateways", icon: CreditCard, group: "Go to" },
  { to: "/admin/finance/gst", label: "Finance · GST Report", icon: Receipt, group: "Finance" },
  { to: "/admin/finance/settlements", label: "Finance · Settlements", icon: Receipt, group: "Finance" },
  { to: "/admin/emails", label: "Email Templates", icon: Mail, group: "Communications" },
  { to: "/admin/users", label: "Employees", icon: UserCog, group: "Settings" },
  { to: "/admin/activity", label: "Activity Log", icon: Activity, group: "Settings" },
  { to: "/admin/audit", label: "Audit Log", icon: ShieldCheck, group: "Settings" },
  { to: "/admin/seo-admin", label: "SEO Pages", icon: Settings, group: "Settings" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const search = useServerFn(globalSearch);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    if (!open) { setQ(""); setHits([]); return; }
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await search({ data: { q } });
        setHits(r.hits);
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(t);
  }, [q, search]);

  const go = useCallback((href: string) => {
    onOpenChange(false);
    navigate({ to: href });
  }, [navigate, onOpenChange]);

  const grouped = QUICK_NAV.reduce<Record<string, typeof QUICK_NAV>>((acc, n) => {
    (acc[n.group] ||= []).push(n);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search customers, applications, invoices…  or jump to a page"
        value={q}
        onValueChange={setQ}
      />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {hits.length > 0 && (
          <>
            <CommandGroup heading="Results">
              {hits.map((h) => (
                <CommandItem key={`${h.kind}-${h.id}`} value={`${h.kind}-${h.title}-${h.id}`} onSelect={() => go(h.href)}>
                  <KindIcon kind={h.kind} />
                  <span>{h.title}</span>
                  {h.subtitle && <span className="ml-auto text-xs opacity-60">{h.subtitle}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        {Object.entries(grouped).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((n) => (
              <CommandItem key={n.to} value={`${group}-${n.label}`} onSelect={() => go(n.to)}>
                <n.icon className="size-4" />
                <span>{n.label}</span>
                {n.shortcut && <span className="ml-auto text-[10px] opacity-50">{n.shortcut}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

function KindIcon({ kind }: { kind: SearchHit["kind"] }) {
  const map = {
    customer: Users, lead: Users, application: FileText,
    invoice: Receipt, certificate: Award, complaint: MessageSquareWarning,
  } as const;
  const Icon = map[kind];
  return <Icon className="size-4" />;
}
