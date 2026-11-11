"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isComplete, useProgress } from "@/lib/progress";

export type TopicListLevel = {
  name: string;
  level: string;
  topics: { id: string; href: string; title: string; blurb: string; hasLesson: boolean }[];
};

/** Written lessons come first, grouped by level. Topics without a lesson are listed separately as planned. */
export function TopicList({ levels, toolName }: { levels: TopicListLevel[]; toolName: string }) {
  const progress = useProgress();
  const written = levels.flatMap((l) => l.topics).filter((t) => t.hasLesson);
  const done = written.filter((t) => isComplete(progress, t.id)).length;
  const plannedLevels = levels.map((l) => ({ ...l, topics: l.topics.filter((t) => !t.hasLesson) })).filter((l) => l.topics.length);
  const plannedCount = plannedLevels.reduce((n, l) => n + l.topics.length, 0);

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Your {toolName} progress</span>
          <span className="text-muted">
            {done} of {written.length} lessons complete
          </span>
        </div>
        <Progress value={written.length ? (done / written.length) * 100 : 0} label={`${toolName} progress`} />
        <p className="mt-3 text-xs text-muted">
          A lesson is complete when you answer all of its knowledge checks correctly. Progress is saved in this browser.
        </p>
      </div>

      {levels
        .map((l) => ({ ...l, topics: l.topics.filter((t) => t.hasLesson) }))
        .filter((l) => l.topics.length)
        .map((level) => (
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
                      ) : (
                        <Circle className="size-5 shrink-0 text-muted" aria-label="Not started" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{t.title}</span>
                        <span className="block truncate text-sm text-muted">{t.blurb}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

      {plannedCount > 0 && (
        <details className="group rounded-2xl border border-dashed border-border bg-surface/60 p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span>
              Planned next: {plannedCount} more {toolName} topics
              <span className="block text-sm font-normal text-muted">Outlined but not written yet. They do not count toward your progress.</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90" aria-hidden="true" />
          </summary>
          <div className="mt-5 space-y-5">
            {plannedLevels.map((l) => (
              <div key={l.name}>
                <h3 className="text-sm font-semibold">{l.name}</h3>
                <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
                  {l.topics.map((t) => (
                    <li key={t.id}>
                      <Link href={t.href} className="underline-offset-4 hover:text-foreground hover:underline">
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
