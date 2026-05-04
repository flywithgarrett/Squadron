import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-9 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-[#0A2540] placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24B] focus-visible:border-[#C8A24B] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
