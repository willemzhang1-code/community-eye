import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  neutral: "bg-foreground/[.06] text-foreground",
  accent: "bg-accent/12 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  muted: "bg-foreground/[.04] text-muted",
};

export function Pill({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      {...rest}
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tabular leading-none",
        toneClass[tone],
        className,
      )}
    />
  );
}
