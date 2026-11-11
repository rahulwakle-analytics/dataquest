"use client";

import { Progress } from "@/components/ui/progress";
import { useChecklist } from "@/lib/checklist";

export function ProjectProgress({ slug, taskCount }: { slug: string; taskCount: number }) {
  const checklist = useChecklist();
  const done = Array.from({ length: taskCount }, (_, i) => `project-${slug}-task-${i}`).filter((id) => checklist[id]).length;
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-medium text-muted" aria-live="polite">
        {done} of {taskCount} tasks done
      </p>
      <Progress value={(done / taskCount) * 100} label={`${slug} tasks done`} />
    </div>
  );
}
