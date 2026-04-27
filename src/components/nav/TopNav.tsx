"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV = [
  { href: "/", label: "看板", match: (p: string) => p === "/" },
  {
    href: "/briefings",
    label: "简报",
    match: (p: string) => p.startsWith("/briefings"),
  },
  {
    href: "/settings",
    label: "档案",
    match: (p: string) => p.startsWith("/settings"),
  },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 glass-strong pt-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-accent to-chart-2 shadow-sm"
          />
          <span className="font-semibold tracking-tight text-[15px]">
            社区之眼
          </span>
          <span className="hidden sm:inline text-subtle text-xs ml-1">
            Community Eye
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-sm transition-colors",
                  active
                    ? "bg-foreground/[.06] text-foreground"
                    : "text-muted hover:text-foreground hover:bg-foreground/[.04]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
