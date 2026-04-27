"use client";

import { clsx } from "clsx";

export type RangeKey = "7d" | "30d" | "90d";

interface Props {
  value: RangeKey;
  onChange: (v: RangeKey) => void;
}

const OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 天" },
  { key: "30d", label: "30 天" },
  { key: "90d", label: "90 天" },
];

export function RangeTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex p-1 rounded-full bg-foreground/[.05] hairline">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            value === o.key
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
