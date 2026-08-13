import { createFileRoute } from "@tanstack/react-router";
import { Route as IndexRoute } from "./index";

export const Route = createFileRoute("/home")({
  loader: IndexRoute.options.loader,
  head: (ctx) => {
    const parentHead = IndexRoute.options.head ? IndexRoute.options.head(ctx) : {};
    return {
      ...parentHead,
      meta: parentHead.meta?.map((m) =>
        "property" in m && m.property === "og:url"
          ? { ...m, content: "https://udyamadhar.in/home" }
          : m,
      ),
      links: parentHead.links?.map((l) =>
        l.rel === "canonical" ? { ...l, href: "https://udyamadhar.in/home" } : l,
      ),
    };
  },
  component: IndexRoute.options.component,
});
