import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Nav } from "./Nav";
import { DisclaimerBar } from "./DisclaimerBar";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Hide DisclaimerBar & Footer on /apply/ waiting pages, post-lead summary, and payment pages
  const isExcludedPage =
    path.startsWith("/apply") ||
    path.startsWith("/processing") ||
    path.startsWith("/success") ||
    path.includes("summary") ||
    path.includes("payment") ||
    path.includes("pay");

  return (
    <div className="min-h-screen flex flex-col bg-background bg-[#194170]">
      <Header />
      <Nav />
      {!isExcludedPage && <DisclaimerBar />}
      <main className="flex-1">{children}</main>
      {!isExcludedPage && <Footer />}
    </div>
  );
}

