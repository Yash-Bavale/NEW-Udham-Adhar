import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2, L as Label2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { a as cn } from "./router-QgJicixe.mjs";
import { s as ChevronRight, E as Check, bv as Circle } from "../_libs/lucide-react.mjs";
import { o as object, s as string, b as boolean, _ as _enum, a as array, n as number } from "../_libs/zod.mjs";
const ReplyInput = object({
  ticketId: string().uuid(),
  message: string().min(1),
  isInternal: boolean().optional(),
  closeTicket: boolean().optional().default(true),
  armAutoclose: boolean().default(true),
  cc: string().optional(),
  bcc: string().optional(),
  attachments: array(object({
    filename: string().min(1).max(255),
    content_base64: string().min(1),
    content_type: string().max(200)
  })).max(10).optional(),
  storedFiles: array(object({
    storage_path: string().min(1).max(500),
    file_name: string().min(1).max(255),
    mime_type: string().max(200),
    file_size: number().int().nonnegative()
  })).max(10).optional()
});
const replyToTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ReplyInput.parse(i)).handler(createSsrRpc("d9c9ef36b53cf84b9a2e945fb56104fdba1ba96871e0671aa2fcc9ca6f4bcf3f"));
const CloseWithReplyInput = object({
  ticketId: string().uuid(),
  message: string().min(1)
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CloseWithReplyInput.parse(i)).handler(createSsrRpc("a50e92b3bc0b31686b381bbc186bfa0469955c928cebda915d4d45ddb3f14325"));
const CloseFinalInput = object({
  ticketId: string().uuid(),
  reason: string().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CloseFinalInput.parse(i)).handler(createSsrRpc("9329bbe0908519771e7717498711da76208d92dc640056a7dad5b7fcd6031c21"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("d39f7a313a28a3ae4629f9222f47e7b1aba875239da644152c18a0af43e1e440"));
const ResumeInput = object({
  ticketId: string().uuid(),
  resumeTo: _enum(["IN_PROCESSING", "SUBMITTED_TO_GOVT"]).default("IN_PROCESSING"),
  note: string().max(1e3).optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ResumeInput.parse(i)).handler(createSsrRpc("a8176ce5c4f52210a1f824a706bd9699e51636c514ec317056128c1a3a2c2346"));
const closeTicketNormalT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("b986717c6d840e8063209d60ece8e5308853eafb3aeaeb3543267dd60c979cf1"));
const closeTicketRestartT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("2eb2b4190cb9b3be465e648582b0b669b7eaf0dcf4c4ff62c62cfeb6fe773566"));
const closeTicketConsultationT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("875bc4b40bc43054de83cc0383b5667754e5ced6e7246ae8db60958f2d32991a"));
const closeTicketReplyReasonT002 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  reasonId: string().uuid().nullable().optional(),
  reasonLabel: string().max(200).optional(),
  replyBody: string().min(1)
}).parse(i)).handler(createSsrRpc("3988ab34b8572744b4aee23991d321bea08f8967870a22ae6be93a1a5c32b51c"));
const closeTicketRefundR002 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  replyBody: string().optional(),
  reasonLabel: string().max(200).optional()
}).parse(i)).handler(createSsrRpc("7ae5b100d8255f04fcbcc6fcff9a4bc89d92185caf898149a00cd623707d9ca8"));
const getTicketAttachmentUploadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120)
}).parse(i)).handler(createSsrRpc("06b48d78dfde01bebe6d3642904b439fb3adb2a72c1748dc844a29beb7c38e19"));
const confirmTicketAttachment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  applicationId: string().uuid().nullable().optional(),
  filePath: string().min(1),
  fileName: string().min(1),
  mimeType: string().min(1),
  sizeBytes: number().int().min(1)
}).parse(i)).handler(createSsrRpc("96ec3e176fbf36926c6f13b2d01cf96b3716c2a00d6bfe2b21e5e438d57513a8"));
const makeOrderHotFromTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid().optional(),
  orderId: string().uuid().optional(),
  note: string().max(1e3).optional()
}).parse(i)).handler(createSsrRpc("713d3edb49d13391d62b4b21cdc36c66cb157d606fa0be7cb185b611287ad861"));
const TICKET_STATUSES = ["open", "in_progress", "waiting_customer", "resolved", "closed"];
const PRIORITIES = ["urgent", "high", "medium", "low"];
const RESPONSE_STATES = ["all", "new", "unread", "awaiting_action", "awaiting_customer", "replied", "closed"];
const listTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(50),
  q: string().default(""),
  bucket: _enum(["all", "need_action", "backlog", "reopened", "refund", "closed", "open", "new"]).optional(),
  status: _enum(TICKET_STATUSES).optional(),
  statuses: array(_enum(TICKET_STATUSES)).optional(),
  responseState: _enum(RESPONSE_STATES).optional().default("all"),
  priority: _enum(PRIORITIES).optional(),
  assignedTo: string().optional(),
  // uuid or "unassigned"
  serviceId: string().uuid().optional(),
  stage: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional(),
  scope: _enum(["mine", "all"]).default("all"),
  sort: _enum(["newest", "oldest", "updated", "last_activity", "highest_priority", "unassigned"]).default("last_activity"),
  unassignedOnly: boolean().default(false),
  isStarred: boolean().optional(),
  folderId: string().uuid().optional()
}).parse(i ?? {})).handler(createSsrRpc("873c3aeb7aaeeac99b72765e98306eaeb37aca8de8c6352714b00543bb0fdb22"));
const getTicketStats = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d59f1962ef7e3cf40fa81dddee94b56f3c2684f7b5e86c333caff6d574e8f9b0"));
const bulkAssignTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketIds: array(string().uuid()).min(1),
  assignedTo: string().uuid().nullable()
}).parse(i)).handler(createSsrRpc("078cdff7ee6a343cf7f2d4f9f715dd2741dca0b97ebc6381132467d589ae2018"));
const bulkUpdateTicketStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketIds: array(string().uuid()).min(1),
  status: _enum(TICKET_STATUSES)
}).parse(i)).handler(createSsrRpc("65d33652e3882fbd92caadff62c49fc5670eaeaa5e0b1eef1de9df1ac76ff3b3"));
const bulkUpdateTicketPriority = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketIds: array(string().uuid()).min(1),
  priority: _enum(PRIORITIES)
}).parse(i)).handler(createSsrRpc("486410dc4a4512bdca9f16a2ee48570e9451aef51ffcb899dc444bec0b486199"));
const bulkMarkTicketsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketIds: array(string().uuid()).min(1)
}).parse(i)).handler(createSsrRpc("2ec8f80e22307b32583d47d9775aaadb6c7e06fffa691e8ab7ce93cd7d68100f"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("cf1e48ef930364020fdf4dc9d1a601b16c458b6d90587a5be483441aaa700148"));
const checkOpenTicketForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("46431139a879e3a1021466b1043485a416433a89ea31788e7fd320c1e51b17a2"));
const createTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  subject: string().trim().min(3).max(200),
  description: string().trim().max(5e3).optional(),
  priority: _enum(PRIORITIES).default("medium"),
  assignedTo: string().uuid().nullable().optional(),
  customerId: string().uuid(),
  applicationId: string().uuid().nullable().optional(),
  source: _enum(["staff", "email_inbound", "web"]).default("staff"),
  allowDuplicate: boolean().default(false),
  category: _enum(["technical", "order_related", "suggestion_to_owner"]).nullable().optional(),
  attachmentUrl: string().url().max(2e3).nullable().optional()
}).parse(i)).handler(createSsrRpc("0067593134eb193da671a475c2adac40f368f2a32fe7848244690c7165394cee"));
const updateTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(TICKET_STATUSES).optional(),
  priority: _enum(PRIORITIES).optional(),
  assignedTo: string().uuid().nullable().optional(),
  resolutionNote: string().trim().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("34b9422b0c03ab57c3e29e53e17ed5b85e879c00f0dca117433f6aa3e04c7850"));
const searchCustomerOptions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().default("")
}).parse(i ?? {})).handler(createSsrRpc("af14603d7dbf4bf37b66da5c021cd47be52f00be29b18ef5655c90259de5accd"));
const getAdjacentTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("984d76ca1c32cc7ff3f579f02c5b2931a6bfc87dccf587a3ba0a670369f07ff7"));
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
export {
  DropdownMenu as D,
  PRIORITIES as P,
  TICKET_STATUSES as T,
  bulkUpdateTicketStatus as a,
  bulkAssignTickets as b,
  bulkUpdateTicketPriority as c,
  bulkMarkTicketsRead as d,
  DropdownMenuTrigger as e,
  DropdownMenuContent as f,
  getTicketStats as g,
  DropdownMenuItem as h,
  DropdownMenuSeparator as i,
  createTicket as j,
  checkOpenTicketForOrder as k,
  listTickets as l,
  getAdjacentTickets as m,
  makeOrderHotFromTicket as n,
  getTicketAttachmentUploadUrl as o,
  confirmTicketAttachment as p,
  closeTicketNormalT001 as q,
  replyToTicket as r,
  searchCustomerOptions as s,
  closeTicketRestartT001 as t,
  updateTicket as u,
  closeTicketConsultationT001 as v,
  closeTicketReplyReasonT002 as w,
  closeTicketRefundR002 as x
};
