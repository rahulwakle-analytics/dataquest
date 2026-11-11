"use client";

import { CheckCircle2, Circle, Eye, Lightbulb } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/learn/code-block";
import { Button } from "@/components/ui/button";
import type { ProjectTask } from "@/content/types";
import { toggleItem, useChecklist } from "@/lib/checklist";
import { cn } from "@/lib/utils";

export function ProjectTaskItem({ id, index, task }: { id: string; index: number; task: ProjectTask }) {
  const checklist = useChecklist();
  const done = Boolean(checklist[id]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <li className={cn("rounded-xl border border-border p-4 transition-colors", done ? "bg-success/5" : "bg-surface/60")}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => toggleItem(id)}
          aria-pressed={done}
          className="mt-0.5 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={done ? `Mark task ${index + 1} as not done` : `Mark task ${index + 1} as done`}
        >
          {done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className={cn("leading-relaxed", done && "text-muted")}>
            <span className="font-medium">{index + 1}. </span>
            {task.instruction}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowHint((s) => !s)}>
              <Lightbulb /> {showHint ? "Hide hint" : "Hint"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSolution((s) => !s)}>
              <Eye /> {showSolution ? "Hide solution" : "Expected output & solution"}
            </Button>
          </div>
          {showHint && <p className="mt-2.5 animate-fade-up rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm leading-relaxed">{task.hint}</p>}
          {showSolution && (
            <div className="mt-2.5 animate-fade-up space-y-2">
              <p className="rounded-lg border border-border bg-card p-3 text-sm leading-relaxed">
                <span className="font-medium">Expected output. </span>
                {task.expectedOutput}
              </p>
              <CodeBlock code={task.solution} lang="sql" />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
