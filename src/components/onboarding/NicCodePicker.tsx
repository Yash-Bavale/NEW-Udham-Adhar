import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, X, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { searchNicCodes, type NicResult } from "@/lib/onboarding/nic.functions";
import { nicLabel } from "@/lib/onboarding/nic-fill";
import { Button } from "@/components/ui/button";

type Props = {
  value: string; // stored as "CODE — Description"
  onChange: (v: string) => void;
  activity?: "Manufacturing" | "Services" | "Trading" | null;
  digits: 2 | 4 | 5;
  required?: boolean;
  id?: string;
  /** Called with the full 5-digit code so the form can fill 2/4/5-digit fields together. */
  onPickCode?: (code5: string) => void;
  /** One editable search above the three saved NIC code fields. */
  inlineSearch?: boolean;
};

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

export function NicCodePicker({ value, onChange, activity, digits, required, id, onPickCode, inlineSearch = false }: Props) {
  const fetchNic = useServerFn(searchNicCodes);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<NicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setResults([]);
    setErr(null);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetchNic({ data: { q: q.trim(), activity: activity ?? null, limit: 25 } });
        if (cancelled) return;
        setResults(res.results);
        if (res.error) setErr(res.error);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q, open, activity, fetchNic]);

  // Always derive display code from r.code (the full 5-digit class code) so
  // we don't lose trailing zeros for divisions/groups stored as numeric in the DB
  // (e.g. group_code "783" instead of "7830").
  const codeFor = (r: NicResult): string =>
    digits === 2 ? r.code.slice(0, 2)
    : digits === 4 ? r.code.slice(0, 4)
    : r.code;

  const trimmed = useMemo(() => {
    if (digits === 5 || onPickCode) return results;
    const seen = new Set<string>();
    const out: NicResult[] = [];
    for (const r of results) {
      const key = codeFor(r);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
    return out;
  }, [results, digits]);

  function pick(r: NicResult) {
    if (onPickCode) onPickCode(r.code);
    else onChange(nicLabel(r.code, digits) ?? `${codeFor(r)} — ${r.description}`);
    setOpen(false);
    setQ("");
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" && trimmed.length) {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, trimmed.length - 1));
    }
    if (e.key === "ArrowUp" && trimmed.length) {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && open && trimmed[activeIndex]) {
      e.preventDefault();
      pick(trimmed[activeIndex]);
    }
  }

  return (
    <div className="relative" ref={wrapRef}>
      <div className="flex gap-2">
        {inlineSearch ? (
          <div className="relative flex-1 min-w-0">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id={id}
              value={open ? q : value}
              onFocus={() => { setQ(""); setActiveIndex(0); setOpen(true); }}
              onClick={() => setOpen(true)}
              onChange={(e) => { setQ(e.target.value); setActiveIndex(0); setOpen(true); }}
              onKeyDown={onSearchKeyDown}
              role="combobox"
              aria-expanded={open}
              aria-controls={id ? `${id}-results` : undefined}
              aria-autocomplete="list"
              autoComplete="off"
              placeholder="Search NIC code or activity (e.g. 4651 or computers)"
              className={inputCls + " pl-10"}
            />
          </div>
        ) : (
          <input
            id={id}
            readOnly
            value={value}
            required={required}
            onClick={() => setOpen(true)}
            placeholder={onPickCode ? "Search activity — fills 2, 4 & 5-digit codes" : `Click to search NIC ${digits}-digit code…`}
            className={inputCls + " cursor-pointer"}
          />
        )}
        {value && (
          <Button
            type="button"
            onClick={() => onChange("")}
            variant="outline"
            size="icon"
            className="h-auto min-h-10 shrink-0 text-muted-foreground"
            aria-label={inlineSearch ? "Clear NIC selection" : "Clear"}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-background shadow-lg overflow-hidden">
          {!inlineSearch && <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search by code or activity description…"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>}
          <div id={id ? `${id}-results` : undefined} role={inlineSearch ? "listbox" : undefined} className="max-h-72 overflow-y-auto">
            {inlineSearch && loading && <div className="px-3 py-3 text-sm text-muted-foreground"><Loader2 className="inline size-4 animate-spin mr-2" />Searching…</div>}
            {err && (
              <div className="px-3 py-3 text-sm text-destructive">{err}</div>
            )}
            {!err && !loading && trimmed.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {q ? "No NIC codes match your search." : "Start typing to search NIC codes."}
              </div>
            )}
            {trimmed.map((r) => {
              const display = onPickCode ? r.code : codeFor(r);
              const selected = value.startsWith(`${display} `);
              return (
                <Button
                  key={r.code}
                  type="button"
                  variant="ghost"
                  onClick={() => pick(r)}
                  role={inlineSearch ? "option" : undefined}
                  aria-selected={inlineSearch ? selected : undefined}
                  onMouseEnter={() => setActiveIndex(trimmed.indexOf(r))}
                  className={`h-auto min-h-10 w-full whitespace-normal text-left px-3 py-2 flex items-start justify-start gap-2 rounded-none border-b border-border/40 last:border-0 ${inlineSearch && activeIndex === trimmed.indexOf(r) ? "bg-muted/60" : ""}`}
                >
                  <span className="font-mono text-xs font-semibold text-brand-navy min-w-[3.5rem]">
                    {display}
                  </span>
                  <span className="text-sm text-foreground flex-1">{r.description}</span>
                  {selected && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                </Button>
              );
            })}
          </div>
          <div className="border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground bg-muted/30">
            {onPickCode ? "Select an activity to fill all three NIC codes" : `Showing NIC ${digits}-digit suggestions`}{activity ? ` for ${activity}` : ""}.
          </div>
        </div>
      )}
    </div>
  );
}
