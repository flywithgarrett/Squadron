import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center text-[10px] tracking-[0.14em] uppercase font-medium px-2 py-1 border border-[color:var(--color-rule-strong)] text-[color:var(--color-ink-60)] tabular",
      className,
    )}
    {...props}
  />
));
Badge.displayName = "Badge";
