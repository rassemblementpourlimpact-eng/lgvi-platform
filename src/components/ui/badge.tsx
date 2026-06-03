import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#f97316] text-white",
        secondary: "bg-[#1e3a5f] text-white",
        success: "bg-[#22c55e] text-white",
        warning: "bg-[#f59e0b] text-white",
        destructive: "bg-[#ef4444] text-white",
        outline: "border border-[#e2e8f0] text-[#0f172a]",
        muted: "bg-[#f1f5f9] text-[#64748b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
