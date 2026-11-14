import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { aL as Route$H, j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { b9 as ArrowLeft, a_ as Save, az as Trash2, aw as Plus } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number, b as boolean, _ as _enum, f as unknown } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./constants-CKRzJJF_.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const WebsiteId = object({
  websiteId: string().uuid()
});
const getWebsiteContent = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteId.parse(i)).handler(createSsrRpc("1c75e2b995d12f6e2782703f5d9c909b7f6f9029ca6bd5a74c38bbe6768bdc4a"));
const NavInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid(),
  nav_group: _enum(["header", "footer"]),
  label: string().trim().min(1).max(120),
  path: string().trim().min(1).max(300),
  open_in_new: boolean().default(false),
  is_active: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0)
});
const upsertNavItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => NavInput.parse(i)).handler(createSsrRpc("3285eb8bd4853d778d0f96aa94ccbe87b7196b047ad27a208fbecbe370274cce"));
const deleteNavItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("400a9865b4b221e3a820829985d481338120f7e70337ed186929639802f0a038"));
const BlockInput = object({
  website_id: string().uuid(),
  block_key: string().trim().min(2).max(120),
  content: unknown(),
  is_active: boolean().default(true)
});
const upsertContentBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BlockInput.parse(i)).handler(createSsrRpc("9177ae3d239452037965edda9ba2c3f94a33cb66eebf1a09a1f711fc6bdd30e2"));
const ContactInput = object({
  websiteId: string().uuid(),
  support_email: string().trim().email().max(200).nullable(),
  support_phone: string().trim().max(60).nullable(),
  whatsapp_number: string().trim().max(60).nullable(),
  business_hours: string().trim().max(200).nullable(),
  postal_address: string().trim().max(500).nullable(),
  footer_unlock_code: string().trim().max(60).nullable(),
  legal_footer_line: string().trim().max(1e3).nullable()
});
const updateWebsiteContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ContactInput.parse(i)).handler(createSsrRpc("a97982866ae58b8c62b684a253dad15791585c10b37aabba5d5c8fa8a3ec5c2c"));
const BLOCK_HINTS = {
  "checkout.disclaimer_footer": '{ "enabled": true }',
  "home.facts": '{ "items": [{ "label": "Label", "value": "Value" }] }',
  "disclaimer.bar": '{ "text": "Disclaimer marquee text" }',
  "footer.address": '{ "text": "Full postal address" }',
  "footer.copyright": '{ "text": "© {{year}} Company. All Rights Reserved." }'
};
const KNOWN_BLOCK_KEYS = Object.keys(BLOCK_HINTS);
function WebsiteContentPage() {
  const {
    websiteId
  } = Route$H.useParams();
  const load = useServerFn(getWebsiteContent);
  const saveNav = useServerFn(upsertNavItem);
  const removeNav = useServerFn(deleteNavItem);
  const saveBlock = useServerFn(upsertContentBlock);
  const saveContact = useServerFn(updateWebsiteContact);
  const qc = useQueryClient();
  const key = ["admin.website.content", websiteId];
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: key,
    queryFn: () => load({
      data: {
        websiteId
      }
    })
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: key
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Loading…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-destructive", children: error.message });
  if (!data) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-8 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/websites", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Websites"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-semibold", children: [
        "Content — ",
        data.website.name,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
          "(",
          data.website.domain,
          ")"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutToggleCard, { websiteId, blocks: data.blocks, onSave: saveBlock, onSaved: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderFooterTextCard, { websiteId, blocks: data.blocks, onSave: saveBlock, onSaved: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContactCard, { website: data.website, onSave: saveContact, onSaved: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NavCard, { group: "header", title: "Header navigation", websiteId, rows: data.nav.filter((n) => n.nav_group === "header"), onSave: saveNav, onDelete: removeNav, onSaved: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NavCard, { group: "footer", title: "Footer — Useful links", websiteId, rows: data.nav.filter((n) => n.nav_group === "footer"), onSave: saveNav, onDelete: removeNav, onSaved: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BlocksCard, { websiteId, blocks: data.blocks, onSave: saveBlock, onSaved: refresh })
  ] });
}
function CheckoutToggleCard({
  websiteId,
  blocks,
  onSave,
  onSaved
}) {
  const existing = blocks.find((b) => b.block_key === "checkout.disclaimer_footer");
  const contentObj = existing?.content ?? {};
  const [enabled, setEnabled] = reactExports.useState(contentObj.enabled ?? true);
  const [busy, setBusy] = reactExports.useState(false);
  const saveToggle = async (val) => {
    setEnabled(val);
    setBusy(true);
    try {
      await onSave({
        data: {
          website_id: websiteId,
          block_key: "checkout.disclaimer_footer",
          content: {
            enabled: val
          },
          is_active: true
        }
      });
      onSaved();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Waiting & Payment Page Display Settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/70", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-slate-800", children: "Show Disclaimer & Footer on Lead Waiting & Payment Pages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-0.5 max-w-2xl", children: [
        "Controls visibility of the Disclaimer Bar and Footer on ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/apply/" }),
        " summary waiting pages and ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/payment/" }),
        " pages. Main public pages always display the disclaimer & footer."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: busy, onClick: () => saveToggle(!enabled), className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? "bg-indigo-600" : "bg-slate-300"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"}` }) })
  ] }) });
}
function HeaderFooterTextCard({
  websiteId,
  blocks,
  onSave,
  onSaved
}) {
  const getBlockVal = (key, def) => {
    const b = blocks.find((x) => x.block_key === key);
    return b?.content?.text ?? def;
  };
  const [brandTitle, setBrandTitle] = reactExports.useState(() => getBlockVal("header.brand_title", "Business Help Services"));
  const [brandSubtitle, setBrandSubtitle] = reactExports.useState(() => getBlockVal("header.brand_subtitle", "Business Consultancy & Assistance Services"));
  const [centerTitle, setCenterTitle] = reactExports.useState(() => getBlockVal("header.center_title", "सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सहायता सेवा"));
  const [centerSubtitle, setCenterSubtitle] = reactExports.useState(() => getBlockVal("header.center_subtitle", "REGISTRATION ADVISORY FOR MICRO, SMALL & MEDIUM ENTERPRISES"));
  const [footerBrandHeading, setFooterBrandHeading] = reactExports.useState(() => getBlockVal("footer.brand_heading", "Business Help Services"));
  const [footerContactName, setFooterContactName] = reactExports.useState(() => getBlockVal("footer.contact_name", "Business Help Services"));
  const [busy, setBusy] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  const saveAll = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await Promise.all([onSave({
        data: {
          website_id: websiteId,
          block_key: "header.brand_title",
          content: {
            text: brandTitle
          },
          is_active: true
        }
      }), onSave({
        data: {
          website_id: websiteId,
          block_key: "header.brand_subtitle",
          content: {
            text: brandSubtitle
          },
          is_active: true
        }
      }), onSave({
        data: {
          website_id: websiteId,
          block_key: "header.center_title",
          content: {
            text: centerTitle
          },
          is_active: true
        }
      }), onSave({
        data: {
          website_id: websiteId,
          block_key: "header.center_subtitle",
          content: {
            text: centerSubtitle
          },
          is_active: true
        }
      }), onSave({
        data: {
          website_id: websiteId,
          block_key: "footer.brand_heading",
          content: {
            text: footerBrandHeading
          },
          is_active: true
        }
      }), onSave({
        data: {
          website_id: websiteId,
          block_key: "footer.contact_name",
          content: {
            text: footerContactName
          },
          is_active: true
        }
      })]);
      setMsg("Header & footer text settings saved successfully!");
      onSaved();
    } catch (e) {
      setMsg(e?.message || "Failed to save text settings");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Header & Footer Dynamic Text Settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-slate-200 pb-2 font-semibold text-xs text-slate-500 uppercase tracking-wider", children: "Header Brand & Title Texts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Header Top Left Brand Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: brandTitle, onChange: (e) => setBrandTitle(e.target.value), placeholder: "Business Help Services" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Header Top Left Subtitle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: brandSubtitle, onChange: (e) => setBrandSubtitle(e.target.value), placeholder: "Business Consultancy & Assistance Services" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Header Center Title (Hindi / Primary Text)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: centerTitle, onChange: (e) => setCenterTitle(e.target.value), placeholder: "सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सहायता सेवा" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Header Center Subtitle (English Subtext)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: centerSubtitle, onChange: (e) => setCenterSubtitle(e.target.value), placeholder: "REGISTRATION ADVISORY FOR MICRO, SMALL & MEDIUM ENTERPRISES" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-slate-200 pb-2 pt-2 font-semibold text-xs text-slate-500 uppercase tracking-wider", children: "Footer Brand & Contact Section Texts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Footer Column 1 Heading" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: footerBrandHeading, onChange: (e) => setFooterBrandHeading(e.target.value), placeholder: "Business Help Services" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Footer Get In Touch Company Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: footerContactName, onChange: (e) => setFooterContactName(e.target.value), placeholder: "Business Help Services" })
      ] })
    ] }),
    msg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600 font-medium", children: msg }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: saveAll, className: "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-3.5" }),
      " ",
      busy ? "Saving…" : "Save Header & Footer Text Settings"
    ] }) })
  ] }) });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children })
  ] });
}
const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function ContactCard({
  website,
  onSave,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(() => ({
    support_email: website.support_email ?? "",
    support_phone: website.support_phone ?? "",
    whatsapp_number: website.whatsapp_number ?? "",
    business_hours: website.business_hours ?? "",
    postal_address: website.postal_address ?? "",
    footer_unlock_code: website.footer_unlock_code ?? "",
    legal_footer_line: website.legal_footer_line ?? ""
  }));
  reactExports.useEffect(() => {
    setForm({
      support_email: website.support_email ?? "",
      support_phone: website.support_phone ?? "",
      whatsapp_number: website.whatsapp_number ?? "",
      business_hours: website.business_hours ?? "",
      postal_address: website.postal_address ?? "",
      footer_unlock_code: website.footer_unlock_code ?? "",
      legal_footer_line: website.legal_footer_line ?? ""
    });
  }, [website]);
  const [busy, setBusy] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await onSave({
        data: {
          websiteId: website.id,
          ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() === "" ? null : v.trim()]))
        }
      });
      setMsg("Saved");
      onSaved();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  const fields = [["support_email", "Support email"], ["support_phone", "Support phone"], ["whatsapp_number", "WhatsApp number"], ["business_hours", "Business hours"], ["postal_address", "Postal address"], ["footer_unlock_code", "Footer SEO-tree unlock code"], ["legal_footer_line", "Legal footer line"]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Contact & legal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: fields.map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form[k], onChange: (e) => setForm((f) => ({
        ...f,
        [k]: e.target.value
      })) })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: submit, className: "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
        " Save"
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: msg })
    ] })
  ] });
}
function NavCard({
  group,
  title,
  websiteId,
  rows,
  onSave,
  onDelete,
  onSaved
}) {
  const [draft, setDraft] = reactExports.useState(rows);
  const [msg, setMsg] = reactExports.useState(null);
  reactExports.useEffect(() => setDraft(rows), [rows]);
  const patch = (id, p) => setDraft((d) => d.map((r) => r.id === id ? {
    ...r,
    ...p
  } : r));
  const persist = async (row) => {
    setMsg(null);
    try {
      await onSave({
        data: {
          id: row.id.startsWith("new-") ? void 0 : row.id,
          website_id: websiteId,
          nav_group: group,
          label: row.label,
          path: row.path,
          open_in_new: row.open_in_new,
          is_active: row.is_active,
          sort_order: row.sort_order
        }
      });
      setMsg("Saved");
      onSaved();
    } catch (e) {
      setMsg(e.message);
    }
  };
  const remove = async (row) => {
    if (row.id.startsWith("new-")) {
      setDraft((d) => d.filter((r) => r.id !== row.id));
      return;
    }
    await onDelete({
      data: {
        id: row.id
      }
    });
    onSaved();
  };
  const nextOrder = reactExports.useMemo(() => draft.length ? Math.max(...draft.map((r) => r.sort_order)) + 10 : 0, [draft]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: draft.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 md:grid-cols-[1fr_1fr_80px_auto_auto_auto] items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: r.label, placeholder: "Label", onChange: (e) => patch(r.id, {
        label: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: r.path, placeholder: "/path", onChange: (e) => patch(r.id, {
        path: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", value: r.sort_order, onChange: (e) => patch(r.id, {
        sort_order: Number(e.target.value)
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: r.is_active, onChange: (e) => patch(r.id, {
          is_active: e.target.checked
        }) }),
        "Active"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => persist(r), className: "rounded-md border border-border px-2 py-2 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => remove(r), className: "rounded-md border border-border px-2 py-2 text-xs text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
    ] }, r.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm", onClick: () => setDraft((d) => [...d, {
        id: `new-${Date.now()}`,
        website_id: websiteId,
        nav_group: group,
        label: "",
        path: "/",
        open_in_new: false,
        is_active: true,
        sort_order: nextOrder
      }]), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add link"
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: msg })
    ] })
  ] });
}
function BlocksCard({
  websiteId,
  blocks,
  onSave,
  onSaved
}) {
  const keys = reactExports.useMemo(() => {
    const set = new Set(KNOWN_BLOCK_KEYS);
    for (const b of blocks) set.add(b.block_key);
    return [...set];
  }, [blocks]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Content blocks", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Each block is JSON. Leave a block empty to keep the built-in default from code." }),
    keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(BlockEditor, { blockKey: k, websiteId, initial: blocks.find((b) => b.block_key === k)?.content, onSave, onSaved }, k))
  ] });
}
function BlockEditor({
  blockKey,
  websiteId,
  initial,
  onSave,
  onSaved
}) {
  const [text, setText] = reactExports.useState(() => initial ? JSON.stringify(initial, null, 2) : "");
  const [msg, setMsg] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    setMsg(null);
    let parsed;
    try {
      parsed = text.trim() === "" ? {} : JSON.parse(text);
    } catch {
      setMsg("Invalid JSON");
      return;
    }
    setBusy(true);
    try {
      await onSave({
        data: {
          website_id: websiteId,
          block_key: blockKey,
          content: parsed,
          is_active: true
        }
      });
      setMsg("Saved");
      onSaved();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border p-3 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs font-semibold", children: blockKey }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        msg && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: msg }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: submit, className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
          " Save"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: `${inputCls} font-mono text-xs min-h-28`, placeholder: BLOCK_HINTS[blockKey] ?? "{}", value: text, onChange: (e) => setText(e.target.value) })
  ] });
}
export {
  WebsiteContentPage as component
};
