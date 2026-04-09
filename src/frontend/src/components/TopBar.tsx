import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { OutlinedButton } from "./OutlinedButton";

const NAV_LINKS = [
  { to: "/cases", label: "Cases" },
  { to: "/theory-match", label: "Theory" },
  { to: "/quiz", label: "Quiz" },
  { to: "/journal", label: "Journal" },
];

export function TopBar() {
  const { identity, login, clear } = useInternetIdentity();
  const { location } = useRouterState();
  const pathname = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
      data-ocid="topbar"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="shrink-0" data-ocid="nav-logo">
          <span className="font-display italic text-lg tracking-[0.15em] text-foreground hover:opacity-70 transition-opacity duration-200">
            VILLAIN ARC
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          data-ocid="nav-links"
        >
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-200 ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`nav-${label.toLowerCase()}`}
              >
                {label}
                {active && <span className="block h-px bg-foreground mt-0.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0" data-ocid="nav-auth">
          {identity ? (
            <OutlinedButton
              size="sm"
              variant="ghost"
              onClick={clear}
              data-ocid="btn-logout"
              title="Sign out"
            >
              <span className="flex items-center gap-1.5">
                <LogOut size={12} />
                <span className="hidden sm:inline">Exit</span>
              </span>
            </OutlinedButton>
          ) : (
            <OutlinedButton size="sm" onClick={login} data-ocid="btn-login">
              <span className="flex items-center gap-1.5">
                <LogIn size={12} />
                <span className="hidden sm:inline">Enter</span>
              </span>
            </OutlinedButton>
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-foreground hover:text-muted-foreground transition-colors duration-200"
            data-ocid="nav-hamburger"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden bg-background border-t border-border"
          data-ocid="mobile-nav"
        >
          <nav className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-0">
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-mono text-[11px] tracking-[0.25em] uppercase py-3 border-b border-border transition-colors duration-200 flex items-center justify-between ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`mobile-nav-${label.toLowerCase()}`}
                >
                  {label}
                  {active && <span className="w-4 h-px bg-foreground" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
