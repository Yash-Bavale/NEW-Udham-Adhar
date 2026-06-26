import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { listServices } from "@/lib/crm/services-admin.functions";
import { convertConsultationLead } from "@/lib/crm/talk-to-expert.functions";

type Props = {
  leadId: string;
  leadCode: string;
};

export function ConvertConsultationPanel({ leadId, leadCode }: Props) {
  const qc = useQueryClient();
  const listFn = useServerFn(listServices);
  const convertFn = useServerFn(convertConsultationLead);

  const [serviceId, setServiceId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.services.active"],
    queryFn: () => listFn(),
  });

  const services = useMemo(
    () =>
      (data?.rows ?? [])
        .filter((s: any) => s.is_active && s.service_name !== "Expert Consultation")
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [data],
  );

  const onSave = async () => {
    if (!serviceId) {
      toast.error("Please pick a service first.");
      return;
    }
    setBusy(true);
    try {
      await convertFn({ data: { leadId, serviceId } });
      toast.success("Service set. Payment link sent to customer.");
      // Refresh everything downstream so PaymentLinkPanel & details update
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin.order"] }),
        qc.invalidateQueries({ queryKey: ["admin.lead-detail", leadId] }),
        qc.invalidateQueries({ queryKey: ["admin.lead-events", leadId] }),
        qc.invalidateQueries({ queryKey: ["admin.payment-link", leadId] }),
        qc.invalidateQueries({ queryKey: ["lead", leadCode] }),
      ]);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not convert lead.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="rounded-lg border bg-amber-50 p-4 space-y-3"
      style={{ borderColor: "rgb(252 211 77)" }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-amber-700" />
        <h3 className="text-sm font-semibold text-amber-900">Set Customer's Service</h3>
      </div>
      <p className="text-xs text-amber-800/90">
        Customer booked a paid Expert Consultation. Pick the service they actually need —
        we'll send the secure payment link to them automatically.
      </p>

      <Select value={serviceId} onValueChange={setServiceId} disabled={busy || isLoading}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder={isLoading ? "Loading services…" : "Select service"} />
        </SelectTrigger>
        <SelectContent>
          {services.map((s: any) => (
            <SelectItem key={s.id} value={s.id}>
              {s.service_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={onSave}
        disabled={busy || !serviceId}
        size="sm"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin mr-1.5" />
        ) : (
          <Send className="size-4 mr-1.5" />
        )}
        Save &amp; Send Payment Link
      </Button>
    </div>
  );
}
