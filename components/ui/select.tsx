import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-9 w-full appearance-none border border-stone-300 bg-white px-3 py-1.5 pr-8 text-sm text-[#0A2540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24B] focus-visible:border-[#C8A24B] disabled:cursor-not-allowed disabled:opacity-50",
      "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235B6770%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_8px_center]",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
