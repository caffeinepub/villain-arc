import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <main className="flex-1 pt-14">{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="font-display italic text-sm text-muted-foreground tracking-widest">
            VILLAIN ARC
          </span>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function LoginLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
