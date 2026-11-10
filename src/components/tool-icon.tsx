import { BarChart3, Database, PieChart, Table2, Terminal, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const map: Record<string, { icon: LucideIcon; cls: string }> = {
  excel: { icon: Table2, cls: "bg-success/10 text-success border-success/25" },
  sql: { icon: Database, cls: "bg-primary/10 text-primary border-primary/25" },
  "power-bi": { icon: BarChart3, cls: "bg-warning/10 text-warning border-warning/25" },
  python: { icon: Terminal, cls: "bg-violet/10 text-violet border-violet/25" },
  tableau: { icon: PieChart, cls: "bg-primary/10 text-primary border-primary/25" },
};

/** Generic category icons, not vendor logos. */
export function ToolIcon({ tool, className }: { tool: string; className?: string }) {
  const { icon: Icon, cls } = map[tool] ?? map.sql;
  return (
    <span className={cn("inline-flex size-11 items-center justify-center rounded-xl border", cls, className)} aria-hidden="true">
      <Icon className="size-5" />
    </span>
  );
}
