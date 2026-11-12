"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, Circle, CircleDot } from "lucide-react";
import { useState } from "react";
import { isComplete, useProgress, type ProgressState } from "@/lib/progress";
import { cn } from "@/lib/utils";

export type SidebarTopic = { id: string; href: string; title: string; hasLesson: boolean };
export type SidebarLevel = { name: string; level: string; topics: SidebarTopic[] };

function statusOf(progress: ProgressState, topicId: string): "done" | "in-progress" | "not-started" {
  if (isComplete(progress, topicId)) return "done";
  if (progress[topicId]) return "in-progress";
  return "not-started";
}

function StatusIcon({ status }: { status: "done" | "in-progress" | "not-started" }) {
  if (status === "done") return <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Completed" />;
  if (status === "in-progress") return <CircleDot className="size-4 shrink-0 text-warning" aria-label="In progress" />;
  return <Circle className="size-4 shrink-0 text-muted/50" aria-label="Not started" />;
}

function Group({ level, currentId }: { level: SidebarLevel; currentId: string }) {
  const progress = useProgress();
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
      >
        {level.name}
        <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", !open && "-rotate-90")} aria-hidden="true" />
      </button>
      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {level.topics.map((t) => {
            const current = t.id === currentId;
            return (
              <li key={t.id}>
                <Link
                  href={t.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    current ? "bg-primary/10 font-medium text-primary" : "text-muted hover:bg-surface hover:text-foreground",
                    !t.hasLesson && !current && "opacity-60",
                  )}
                >
                  <StatusIcon status={t.hasLesson ? statusOf(progress, t.id) : "not-started"} />
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Left-hand topic sidebar for a learning path's lesson pages: grouped by level, with real
 * completion status, the current topic highlighted, and collapsible groups. */
export function LessonSidebar({ levels, currentId }: { levels: SidebarLevel[]; currentId: string }) {
  return (
    <nav aria-label="Topics in this path" className="space-y-4">
      {levels.map((level) => (
        <Group key={level.name} level={level} currentId={currentId} />
      ))}
    </nav>
  );
}
