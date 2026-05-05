import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-[13px] font-medium tracking-[-0.005em] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A24B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA]",
  {
    variants: {
      variant: {
        primary: "bg-[#0A2540] text-white hover:bg-[#11305B]",
        ghost: "text-[#0A2540] hover:bg-[color:var(--color-hairline)]",
        link: "text-[color:var(--color-navy-soft)] hover:text-[#0A2540] px-0",
      },
      size: {
        sm: "h-8 px-3 rounded-[var(--radius-sm)]",
        md: "h-10 px-5 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
