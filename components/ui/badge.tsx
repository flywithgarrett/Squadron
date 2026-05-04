import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center text-[11px] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border",
  {
    variants: {
      variant: {
        default: "bg-[#0A2540] text-white border-[#0A2540]",
        outline: "bg-transparent text-[#5B6770] border-stone-300",
        gold: "bg-[#C8A24B] text-white border-[#C8A24B]",
        muted: "bg-[#F4F1EA] text-[#5B6770] border-stone-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
