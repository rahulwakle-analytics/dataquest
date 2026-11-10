import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      neutral: "border-border bg-surface text-muted",
      primary: "border-primary/30 bg-primary/10 text-primary",
      violet: "border-violet/30 bg-violet/10 text-violet",
      success: "border-success/30 bg-success/10 text-success",
      warning: "border-warning/30 bg-warning/10 text-warning",
      danger: "border-danger/30 bg-danger/10 text-danger",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function difficultyVariant(d: string): "success" | "warning" | "danger" | "neutral" {
  if (d === "Easy" || d === "Beginner") return "success";
  if (d === "Medium" || d === "Intermediate") return "warning";
  if (d === "Hard" || d === "Advanced") return "danger";
  return "neutral";
}
