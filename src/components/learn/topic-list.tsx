"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle, CircleDashed } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isComplete, useProgress } from "@/lib/progress";

export type TopicListLevel = {
  name: string;
  level: string;
  topics: { id: string; href: string; title: string; blurb: string; hasLesson: boolean }[];
};

export function TopicList({ levels, toolName }: { levels: TopicListLevel[]; toolName: string }) {
  const progress = useProgress();
  const all = levels.flatMap((l) => l.topics);
  const done = all.filter((t) => isComplete(progress, t.id)).length;

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Your {toolName} progress</span>
          <span className="text-muted">
            {done} of {all.length} topics complete
          </span>
        </div>
        <Progress value={all.length ? (done / all.length) * 100 : 0} label={`${toolName} progress`} />
        <p className="mt-3 text-xs text-muted">
          A topic is complete when you answer all of its knowledge checks correctly. Progress is saved in this browser.
        </p>
      </div>

      {levels.map((level) => (
        <section key={level.name} aria-labelledby={`lvl-${level.name}`}>
          <div className="mb-4 flex items-center gap-3">
            <h2 id={`lvl-${level.name}`} className="text-xl font-semibold tracking-tight">
              {level.name}
            </h2>
            <Badge variant={difficultyVariant(level.level)}>{level.level}</Badge>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {level.topics.map((t) => {
              const complete = isComplete(progress, t.id);
              return (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    {complete ? (
                      <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Complete" />
                    ) : t.hasLesson ? (
                      <Circle className="size-5 shrink-0 text-muted" aria-label="Not started" />
                    ) : (
                      <CircleDashed className="size-5 shrink-0 text-muted/60" aria-label="Lesson not written yet" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{t.title}</span>
                      <span className="block truncate text-sm text-muted">{t.blurb}</span>
                    </span>
                    {!t.hasLesson && <Badge className="hidden sm:inline-flex">In development</Badge>}
                    <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
