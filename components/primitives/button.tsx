import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-[13px] font-medium tracking-[-0.005em] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-canvas)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] hover:bg-[#11305B] active:scale-[0.99]",
        ghost:
          "text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)]",
        link:
          "text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] px-0",
      },
      size: {
        sm: "h-8 px-3 rounded-[var(--radius-sm)]",
        md: "h-11 px-6 rounded-[var(--radius-sm)]",
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
