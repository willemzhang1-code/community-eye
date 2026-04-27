"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const TABS = [
  {
    href: "/",
    label: "看板",
    match: (p: string) => p === "/" || p.startsWith("/games"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M4 5a2 2 0 012-2h3v8H4V5zm0 10h5v6H6a2 2 0 01-2-2v-4zm7-12h7a2 2 0 012 2v4h-9V3zm0 8h9v8a2 2 0 01-2 2h-7v-10z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "/briefings",
    label: "简报",
    match: (p: string) => p.startsWith("/briefings"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M5 4a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5zm2 5h10v2H7V9zm0 4h10v2H7v-2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "档案",
    match: (p: string) => p.startsWith("/settings"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M12 2l9 4v6c0 5-3.8 9.4-9 10-5.2-.6-9-5-9-10V6l9-4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t hairline pb-safe"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around max-w-md mx-auto px-2 pt-1.5">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={clsx(
                  "flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-medium transition-colors",
                  active ? "text-accent" : "text-subtle hover:text-foreground",
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
