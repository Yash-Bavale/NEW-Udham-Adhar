import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Mail, UserCog, Tag, Trash2, X } from "lucide-react";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { listAssignableStaff } from "@/lib/crm/leads-bulk.functions";
import { BulkEmailDialog } from "./BulkEmailDialog";
import { useRole } from "@/hooks/useRole";

export function LeadsBulkBar({
  selectedIds,
  onClear,
  onStatus,
  onAssign,
  onDelete,
  busy,
}: {
  selectedIds: string[];
  onClear: () => void;
  onStatus: (status: string) => void;
  onAssign: (assignee: string | null) => void;
  onDelete: () => void;
  busy?: boolean;
}) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const role = useRole();
  const staffFn = useServerFn(listAssignableStaff);
  const { data: staff } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
    enabled: assignOpen,
  });

  const isAdmin = role.hasAny(["super_admin", "admin"]);

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-xl border shadow-xl flex items-center gap-1 px-2 py-2 backdrop-blur"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <span className="px-3 text-sm font-medium" style={{ color: "var(--admin-fg)" }}>
            {selectedIds.length} selected
          </span>
          <div className="h-5 w-px" style={{ background: "var(--admin-border)" }} />
          <PopBtn icon={<Tag className="size-4" />} label="Status" onClick={() => { setStatusOpen(!statusOpen); setAssignOpen(false); }} active={statusOpen} />
          <PopBtn icon={<UserCog className="size-4" />} label="Assign" onClick={() => { setAssignOpen(!assignOpen); setStatusOpen(false); }} active={assignOpen} />
          <PopBtn icon={<Mail className="size-4" />} label="Email" onClick={() => setEmailOpen(true)} />
          {isAdmin && <PopBtn icon={<Trash2 className="size-4" />} label="Delete" onClick={onDelete} danger />}
          <button onClick={onClear} className="ml-1 p-1.5 rounded hover:bg-[var(--admin-surface-2)]" aria-label="Clear selection">
            <X className="size-4" />
          </button>

          {statusOpen && (
            <Pop position="up">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => { setStatusOpen(false); onStatus(s); }}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)] capitalize"
                >
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </Pop>
          )}
          {assignOpen && (
            <Pop position="up">
              <button
                onClick={() => { setAssignOpen(false); onAssign(null); }}
                className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)]"
              >
                Unassign
              </button>
              {(staff?.rows ?? []).map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setAssignOpen(false); onAssign(u.id); }}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)]"
                >
                  {u.name}
                </button>
              ))}
              {staff && staff.rows.length === 0 && (
                <div className="px-3 py-2 text-xs" style={{ color: "var(--admin-fg-muted)" }}>No staff found.</div>
              )}
            </Pop>
          )}
        </motion.div>
      )}
      {emailOpen && (
        <BulkEmailDialog
          ids={selectedIds}
          onClose={() => setEmailOpen(false)}
          onSent={() => { setEmailOpen(false); onClear(); }}
        />
      )}
    </AnimatePresence>
  );
}

function PopBtn({ icon, label, onClick, active, danger }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition ${
        active ? "bg-[var(--admin-surface-2)]" : "hover:bg-[var(--admin-surface-2)]"
      } ${danger ? "text-rose-600" : ""}`}
      style={{ color: danger ? undefined : "var(--admin-fg)" }}
    >
      {icon}<span>{label}</span>
    </button>
  );
}

function Pop({ children, position = "up" }: { children: React.ReactNode; position?: "up" | "down" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === "up" ? 6 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg border shadow-lg p-1 min-w-[180px] max-h-72 overflow-y-auto"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      {children}
    </motion.div>
  );
}
