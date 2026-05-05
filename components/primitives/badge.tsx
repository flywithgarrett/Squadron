import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center text-[10px] tracking-[0.12em] uppercase font-medium px-1.5 py-0.5 border border-[color:var(--color-hairline-strong)] text-[color:var(--color-navy-soft)] tabular",
      className,
    )}
    {...props}
  />
));
Badge.displayName = "Badge";
