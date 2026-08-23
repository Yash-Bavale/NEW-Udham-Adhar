import { useState } from "react";
import { Download, X, Calendar, Filter, FileSpreadsheet, Check } from "lucide-react";

export type ExportScope = "filtered" | "selected" | "all";
export type ExportFormat = "csv" | "excel";

export interface ExportModalOptions {
  scope: ExportScope;
  format: ExportFormat;
  dateFrom?: string;
  dateTo?: string;
}

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportModalOptions) => Promise<void>;
  selectedCount?: number;
  activeFiltersCount?: number;
  initialDateFrom?: string;
  initialDateTo?: string;
}

export function ExportModal({
  title,
  isOpen,
  onClose,
  onExport,
  selectedCount = 0,
  activeFiltersCount = 0,
  initialDateFrom = "",
  initialDateTo = "",
}: Props) {
  const [scope, setScope] = useState<ExportScope>(selectedCount > 0 ? "selected" : "filtered");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [dateFrom, setDateFrom] = useState<string>(initialDateFrom);
  const [dateTo, setDateTo] = useState<string>(initialDateTo);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onExport({
        scope,
        format,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 space-y-6"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--admin-border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Download className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                Choose filters, scope and export format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--admin-surface-2)] transition"
            style={{ color: "var(--admin-fg-muted)" }}
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Scope selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Export Scope</label>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  scope === "filtered"
                    ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "hover:bg-[var(--admin-surface-2)]"
                }`}
                style={{ borderColor: scope === "filtered" ? undefined : "var(--admin-border)" }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="scope"
                    value="filtered"
                    checked={scope === "filtered"}
                    onChange={() => setScope("filtered")}
                    className="accent-emerald-600 size-4"
                  />
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5">
                      <Filter className="size-3.5 text-emerald-600" /> Current Filtered View
                    </div>
                    <div className="text-xs text-slate-500">
                      {activeFiltersCount > 0
                        ? `Respects active search & dropdown filters (${activeFiltersCount} active)`
                        : "Exports matching records"}
                    </div>
                  </div>
                </div>
              </label>

              {selectedCount > 0 && (
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    scope === "selected"
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "hover:bg-[var(--admin-surface-2)]"
                  }`}
                  style={{ borderColor: scope === "selected" ? undefined : "var(--admin-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="scope"
                      value="selected"
                      checked={scope === "selected"}
                      onChange={() => setScope("selected")}
                      className="accent-emerald-600 size-4"
                    />
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-600" /> Selected Items Only
                      </div>
                      <div className="text-xs text-slate-500">{selectedCount} row(s) checked</div>
                    </div>
                  </div>
                </label>
              )}

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  scope === "all"
                    ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "hover:bg-[var(--admin-surface-2)]"
                }`}
                style={{ borderColor: scope === "all" ? undefined : "var(--admin-border)" }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="scope"
                    value="all"
                    checked={scope === "all"}
                    onChange={() => setScope("all")}
                    className="accent-emerald-600 size-4"
                  />
                  <div>
                    <div className="text-sm font-semibold">All Records</div>
                    <div className="text-xs text-slate-500">Unfiltered database export</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Date range filter override */}
          {scope !== "selected" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="size-3.5" /> Date Range Filter (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500">From Date</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none"
                    style={{ background: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">To Date</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none"
                    style={{ background: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileSpreadsheet className="size-3.5" /> Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  format === "csv"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "hover:bg-[var(--admin-surface-2)] text-slate-700 dark:text-slate-200"
                }`}
                style={{ borderColor: format === "csv" ? undefined : "var(--admin-border)" }}
              >
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  format === "excel"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "hover:bg-[var(--admin-surface-2)] text-slate-700 dark:text-slate-200"
                }`}
                style={{ borderColor: format === "excel" ? undefined : "var(--admin-border)" }}
              >
                Excel (.xls)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[var(--admin-surface-2)] transition"
              style={{ color: "var(--admin-fg-muted)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Download className="size-4" /> {loading ? "Exporting…" : "Download Export"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
