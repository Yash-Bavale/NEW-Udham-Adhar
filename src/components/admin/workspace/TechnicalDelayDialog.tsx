import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Server, CheckCircle2, Info, Search } from "lucide-react";
import { setExternalDelay, listDelayReasons } from "@/lib/crm/workflow.functions";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}

export function TechnicalDelayDialog({ applicationId, open, onClose }: Props) {
  const qc = useQueryClient();
  const fnReasons = useServerFn(listDelayReasons);
  const fnSubmit = useServerFn(setExternalDelay);

  const { data: reasons, isLoading: reasonsLoading } = useQuery({
    queryKey: ["workflow-delay-reasons"],
    queryFn: () => fnReasons({ data: {} as never }),
    enabled: open,
  });

  const [reasonCode, setReasonCode] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [search, setSearch] = useState("");

  const allReasons = reasons?.reasons ?? [];
  const filteredReasons = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allReasons
      .filter((r: any) => (r.side ?? "customer") === "internal")
      .filter((r: any) => !s || r.label.toLowerCase().includes(s) || (r.description ?? "").toLowerCase().includes(s))
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [allReasons, search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setInternalNote("");
      setReasonCode("");
    }
  }, [open]);

  useEffect(() => {
    if (open && filteredReasons.length && !filteredReasons.find((r: any) => r.code === reasonCode)) {
      setReasonCode(filteredReasons[0].code);
    }
  }, [open, reasons]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = filteredReasons.find((r: any) => r.code === reasonCode) ?? null;

  const mut = useMutation({
    mutationFn: async () => {
      const reason = allReasons.find((r) => r.code === reasonCode);
      if (!reason) throw new Error("Please pick a reason");
      await fnSubmit({
        data: {
          applicationId,
          reasonCode,
          reasonLabel: reason.label,
          internalNote: internalNote || undefined,
          expectedReviewAt: new Date().toISOString(),
          priority: "normal",
          kind: "government_portal_pending",
        },
      });
    },
    onSuccess: () => {
      toast.success("Technical delay marked — order placed on hold.");
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["orders-v2"] });
      qc.invalidateQueries({ queryKey: ["active-order-callback"] });
      qc.invalidateQueries({ queryKey: ["active-order-callback", applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to mark delay"),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="shrink-0 px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-white">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center size-9 rounded-full bg-sky-100 text-sky-700 shrink-0">
              <Server className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base">Our-side (technical) delay — internal follow-up</DialogTitle>
              <DialogDescription className="text-xs">
                Marks the order on technical hold and notifies the customer of the delay.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="border-r">
              <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search internal reasons…"
                    className="pl-8 h-8 text-sm"
                  />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {filteredReasons.length} reason{filteredReasons.length === 1 ? "" : "s"}
                </Badge>
              </div>

              <ScrollArea className="h-[220px] md:h-[260px] px-4 pb-4">
                {reasonsLoading ? (
                  <div className="grid place-items-center h-40 text-sm text-slate-500">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : filteredReasons.length === 0 ? (
                  <div className="text-sm text-slate-500 py-10 text-center">No internal reasons configured.</div>
                ) : (
                  <div className="space-y-1.5">
                    {filteredReasons.map((r: any) => {
                      const on = r.code === reasonCode;
                      return (
                        <button
                          key={r.code}
                          type="button"
                          onClick={() => setReasonCode(r.code)}
                          className={cn(
                            "w-full text-left rounded-lg border p-2.5 transition",
                            on ? "border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-200" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className={cn("mt-0.5 size-4 rounded-full border grid place-items-center shrink-0", on ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 bg-white")}>
                              {on && <CheckCircle2 className="size-3" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-medium text-slate-900 leading-snug">{r.label}</div>
                              {r.description && (
                                <div className="text-[11.5px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{r.description}</div>
                              )}
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[9.5px] font-mono uppercase text-slate-400 tracking-wider">{r.code}</span>
                                {r.email_template_code && (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                                    {r.email_template_code.toUpperCase().replace("BHS_", "")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="p-4 bg-slate-50/30">
              <div className="rounded-md border border-sky-200 bg-sky-50/70 p-3 text-[11.5px] text-sky-900 flex gap-2">
                <Info className="size-3.5 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  Customer will receive a delay notification email. The order is placed on <b>Technical Delay</b> hold until you <b>Resume</b> it.
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t bg-white">
            <Label className="text-[11px] uppercase tracking-wider text-slate-500">Internal note / instructions for team</Label>
            <Textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={2}
              className="mt-1 text-sm"
              placeholder={selected?.description ? `e.g. ${selected.description}` : "Describe technical issue or next action…"}
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 px-5 py-3 border-t bg-slate-50 gap-2">
          <div className="mr-auto text-[11px] text-slate-500 flex items-center gap-1.5">
            {selected ? (
              <>
                <CheckCircle2 className="size-3 text-sky-600" />
                <span>Selected: <b className="text-slate-700">{selected.label}</b></span>
              </>
            ) : (
              <span>Pick an internal reason to continue</span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending || !reasonCode} className="gap-1.5">
            {mut.isPending && <Loader2 className="size-3 animate-spin" />}
            Mark Technical Delay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
