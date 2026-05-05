import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[#FBFAF6] border border-[color:var(--color-hairline)]",
      className,
    )}
    style={{ boxShadow: "0 1px 2px rgba(10, 37, 64, 0.04)" }}
    {...props}
  />
));
Card.displayName = "Card";
