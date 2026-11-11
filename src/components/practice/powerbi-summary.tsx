"use client";

import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { challengeId, powerbiExercises, XP } from "@/content/powerbi-practice";
import { isSolved, useProgress } from "@/lib/progress";

export function PowerBiSummary() {
  const progress = useProgress();
  const solved = powerbiExercises.filter((e) => isSolved(progress, challengeId(e.slug), 0));
  const earned = solved.reduce((n, e) => n + XP[e.difficulty], 0);
  const total = powerbiExercises.reduce((n, e) => n + XP[e.difficulty], 0);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          {solved.length} of {powerbiExercises.length} exercises solved
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Zap className="size-4 text-primary" aria-hidden="true" /> {earned} of {total} XP
        </span>
      </div>
      <Progress value={(solved.length / powerbiExercises.length) * 100} label="Power BI exercises solved" />
      <p className="mt-3 text-xs text-muted">XP is counted once per exercise, only when you pick the right answer. Saved in this browser.</p>
    </div>
  );
}
