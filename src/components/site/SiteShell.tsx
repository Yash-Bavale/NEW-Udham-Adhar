import { type ReactNode } from "react";
import { Header } from "./Header";
import { Nav } from "./Nav";
import { DisclaimerBar } from "./DisclaimerBar";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Nav />
      <DisclaimerBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
