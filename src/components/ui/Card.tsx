import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  glass,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { glass?: boolean }) {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-[20px] border hairline",
        glass ? "glass" : "bg-surface",
        className,
      )}
    />
  );
}

export function CardSection({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={clsx("p-5 sm:p-6", className)} />;
}
