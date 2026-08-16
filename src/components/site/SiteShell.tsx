import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Nav } from "./Nav";
import { DisclaimerBar } from "./DisclaimerBar";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Hide footer & disclaimer bar on after-lead submission waiting pages (/apply/, /processing/, /onboarding/) & payment pages (/payment/)
  const isApplyOrPaymentPage =
    path.startsWith("/apply") ||
    path.startsWith("/payment") ||
    path.startsWith("/processing") ||
    path.startsWith("/onboarding") ||
    path.startsWith("/payment-pending") ||
    path.startsWith("/payment-failed");

  return (
    <div className="min-h-screen flex flex-col bg-background bg-[#194170]">
      <Header />
      <Nav />
      {!isApplyOrPaymentPage && <DisclaimerBar />}
      <main className="flex-1">{children}</main>
      {!isApplyOrPaymentPage && <Footer />}
    </div>
  );
}
