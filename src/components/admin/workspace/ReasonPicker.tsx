// Phase 3 — Reason Picker (14 close reasons grouped A/B/C).
// Shows the standard reply for the selected reason as an editable draft.
import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCloseReasons, type OrderCloseReason } from "@/lib/orders/actions/reasons.functions";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CATEGORY_LABEL: Record<string, string> = {
  A: "A — Customer-side",
  B: "B — External / Govt",
  C: "C — Internal",
};

interface Props {
  value: string | null;
  onChange: (reasonId: string, reason: OrderCloseReason | null) => void;
  reply: string;
  onReplyChange: (reply: string) => void;
  /** Hide the reply textarea when the caller only wants the reason id. */
  hideReply?: boolean;
  disabled?: boolean;
}

export function ReasonPicker({ value, onChange, reply, onReplyChange, hideReply, disabled }: Props) {
  const fetchReasons = useServerFn(listCloseReasons);
  const { data: reasons = [], isLoading } = useQuery({
    queryKey: ["order-close-reasons"],
    queryFn: () => fetchReasons(),
    staleTime: 5 * 60_000,
  });

  const grouped = useMemo(() => {
    const g = new Map<string, OrderCloseReason[]>();
    for (const r of reasons) {
      if (!g.has(r.category)) g.set(r.category, []);
      g.get(r.category)!.push(r);
    }
    return g;
  }, [reasons]);

  const selected = reasons.find((r) => r.id === value) ?? null;

  // Auto-fill the reply when a reason is picked and the reply is empty/from-prev-standard.
  useEffect(() => {
    if (selected && !reply.trim() && selected.standard_reply) {
      onReplyChange(selected.standard_reply);
    }
     
  }, [selected?.id]);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-500">Reason</Label>
        <Select
          value={value ?? undefined}
          onValueChange={(id) => onChange(id, reasons.find((r) => r.id === id) ?? null)}
          disabled={disabled || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading reasons…" : "Select a reason"} />
          </SelectTrigger>
          <SelectContent className="max-h-96">
            {[...grouped.entries()].map(([cat, list]) => (
              <SelectGroup key={cat}>
                <SelectLabel>{CATEGORY_LABEL[cat] ?? cat}</SelectLabel>
                {list.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <span className="font-mono text-xs text-slate-400 mr-2">{r.category}{r.number}</span>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hideReply && (
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-slate-500">
            Reply to customer {selected?.standard_reply ? "(editable)" : ""}
          </Label>
          <Textarea
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            rows={5}
            placeholder="Standard reply will pre-fill when you pick a reason."
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
