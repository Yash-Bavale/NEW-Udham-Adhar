import { Phone, Mail, MessageCircle, FileText, Upload, FileCheck2, Printer } from "lucide-react";

interface Props {
  customerMobile?: string | null;
  customerEmail?: string | null;
  serviceName?: string | null;
  orderCode?: string | null;
  /** Whether the current user can mark complete */
  canComplete?: boolean;
  onRequestDocs: () => void;
  onUploadCert: () => void;
  onComplete: () => void;
}

/**
 * Persistent action bar — always visible right under the sticky header.
 * One row, icon + label, keyboard-friendly. The most-likely next actions
 * are surfaced first; later ones (Print) trail.
 */
export function OrderActionBar({
  customerMobile, customerEmail, serviceName, orderCode,
  canComplete = true,
  onRequestDocs, onUploadCert, onComplete,
}: Props) {
  const whatsappText = encodeURIComponent(
    `Hi, this is regarding your ${serviceName ?? "service"} application${orderCode ? ` (${orderCode})` : ""}.`,
  );
  const whatsappHref = customerMobile
    ? `https://wa.me/${String(customerMobile).replace(/\D/g, "")}?text=${whatsappText}`
    : null;
  const telHref = customerMobile ? `tel:${customerMobile}` : null;
  const mailHref = customerEmail ? `mailto:${customerEmail}` : null;

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 rounded-xl border px-2.5 py-2"
      style={{
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      <Action href={telHref} icon={Phone} label="Call" />
      <Action href={whatsappHref} icon={MessageCircle} label="WhatsApp" external />
      <Action href={mailHref} icon={Mail} label="Email" />

      <Divider />

      <Action onClick={onRequestDocs} icon={FileText} label="Request Docs" />
      <Action onClick={onUploadCert} icon={Upload} label="Upload Certificate" />

      {canComplete && (
        <Action onClick={onComplete} icon={FileCheck2} label="Complete Order" tone="primary" />
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <Action onClick={() => window.print()} icon={Printer} label="Print" />
      </div>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-5 mx-1" style={{ background: "var(--admin-border)" }} />;
}

function Action({
  href, onClick, icon: Icon, label, external, tone,
}: {
  href?: string | null;
  onClick?: () => void;
  icon: typeof Phone;
  label: string;
  external?: boolean;
  tone?: "primary";
}) {
  const isDisabled = href === null && !onClick;
  const cls =
    tone === "primary"
      ? "text-white border-transparent"
      : "border";
  const style =
    tone === "primary"
      ? { background: "#1F4E79", color: "#fff" }
      : { background: "transparent", color: "var(--admin-fg)", borderColor: "var(--admin-border)" };

  const inner = (
    <>
      <Icon className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </>
  );

  const baseClass = `inline-flex items-center gap-1.5 rounded-md px-2.5 h-8 text-xs font-medium transition-all hover:shadow-sm ${cls} ${
    isDisabled ? "opacity-40 cursor-not-allowed" : ""
  }`;

  if (href && !isDisabled) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={baseClass}
        style={style}
      >
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} disabled={isDisabled} className={baseClass} style={style} type="button">
      {inner}
    </button>
  );
}
