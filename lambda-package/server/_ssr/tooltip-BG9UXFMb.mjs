import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root3, T as Trigger, P as Provider, a as Portal, C as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { a as cn } from "./router-QgJicixe.mjs";
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
export {
  TooltipProvider as T,
  Tooltip as a,
  TooltipTrigger as b,
  TooltipContent as c
};
