"use client";

import { CheckCircle2 } from "lucide-react";
import { isComplete, useProgress } from "@/lib/progress";

export function TopicStatus({ topicId, total }: { topicId: string; total: number }) {
  const progress = useProgress();
  const correct = Object.values(progress[topicId]?.checks ?? {}).filter(Boolean).length;
  if (isComplete(progress, topicId)) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success">
        <CheckCircle2 className="size-4" /> Topic complete
      </p>
    );
  }
  return (
    <p className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
      {correct} of {total} knowledge checks correct
    </p>
  );
}
