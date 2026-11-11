"use client";

import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, ChevronDown, Circle } from "lucide-react";
import { useState } from "react";
import { Checklist } from "@/components/career/checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { RoadmapStage } from "@/content/career";
import { projects } from "@/content/projects";
import { useChecklist } from "@/lib/checklist";
import { isComplete, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const projectSlugFromHref = (href?: string) => href?.split("#")[1] ?? "";
/** A project counts as done only once every one of its real, verifiable tasks is ticked on its own page — never from a click here. */
const isProjectDone = (slug: string, ticks: Record<string, true>) => {
  const p = projects.find((x) => x.slug === slug);
  return Boolean(p) && p!.tasks.every((_, i) => ticks[`project-${slug}-task-${i}`]);
};

export type StageData = RoadmapStage & {
  /** Written lessons of the linked learning path. */
  lessons?: { id: string; title: string }[];
  planned?: number;
  pathName?: string;
};

export function RoadmapView({ stages }: { stages: StageData[] }) {
  const progress = useProgress();
  const ticks = useChecklist();
  const [open, setOpen] = useState<string | null>(stages[0].id);

  const status = stages.map((s) => {
    const total = s.lessons ? s.lessons.length : (s.items?.length ?? 0);
    const done = s.lessons
      ? s.lessons.filter((l) => isComplete(progress, l.id)).length
      : s.id === "projects"
        ? (s.items ?? []).filter((item) => isProjectDone(projectSlugFromHref(item.href), ticks)).length
        : (s.items ?? []).filter((_, i) => ticks[`roadmap:${s.id}:${i}`]).length;
    return { total, done, complete: total > 0 && done === total };
  });
  const completeCount = status.filter((s) => s.complete).length;
  const nextIndex = status.findIndex((s) => !s.complete);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium">Your roadmap</span>
          <span className="text-muted" aria-live="polite">
            {completeCount} of {stages.length} stages complete
          </span>
        </div>
        <Progress value={(completeCount / stages.length) * 100} label="Roadmap progress" />
        <p className="mt-3 text-xs text-muted">
          Tool stages complete when you pass the knowledge checks in their lessons. The projects stage completes from the tasks you tick on each project's own page. Remaining stages use tick lists you mark
          yourself. Everything is saved in this browser.
        </p>
      </div>

      <ol className="mt-8">
        {stages.map((s, i) => {
          const st = status[i];
          const isOpen = open === s.id;
          const isNext = i === nextIndex;
          return (
            <li key={s.id} className="relative pb-5 pl-14 last:pb-0">
              {i < stages.length - 1 && <span aria-hidden="true" className={cn("absolute bottom-0 left-[19px] top-10 w-0.5", st.complete ? "bg-success" : "bg-border")} />}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-3 inline-flex size-10 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold",
                  st.complete ? "border-success text-success" : isNext ? "border-primary text-primary" : "border-border text-muted",
                )}
              >
                {st.complete ? <Check className="size-5" /> : i + 1}
              </span>

              <div className={cn("overflow-hidden rounded-2xl border bg-card transition-colors", isOpen ? "border-primary/50" : "border-border")}>
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`stage-${s.id}`}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium uppercase tracking-wide text-muted">Stage {i + 1}</span>
                      <span className="block text-lg font-semibold tracking-tight">{s.title}</span>
                    </span>
                    {st.complete ? <Badge variant="success">Complete</Badge> : isNext ? <Badge variant="primary">Up next</Badge> : null}
                    <span className="hidden text-sm tabular-nums text-muted sm:block">
                      {st.done} / {st.total}
                    </span>
                    <ChevronDown className={cn("size-4 shrink-0 text-muted transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                </h2>

                {isOpen && (
                  <div id={`stage-${s.id}`} className="animate-fade-up space-y-6 border-t border-border px-5 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                        <h3 className="text-sm font-semibold">Why this matters</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.why}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-4">
                        <h3 className="text-sm font-semibold">Prerequisites</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.prerequisite}</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold">Learning objectives</h3>
                        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
                          {s.objectives.map((o) => (
                            <li key={o} className="flex items-start gap-2">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Skills you build</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.skills.map((k) => (
                            <Badge key={k}>{k}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">Topics to complete</h3>
                      {s.note && <p className="mt-1.5 text-sm text-muted">{s.note}</p>}
                      {s.lessons ? (
                        <>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {s.lessons.map((l) => {
                              const done = isComplete(progress, l.id);
                              return (
                                <li key={l.id}>
                                  <Link
                                    href={`/paths/${l.id}`}
                                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:border-primary/50 hover:bg-surface"
                                  >
                                    {done ? <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Complete" /> : <Circle className="size-4 shrink-0 text-muted" aria-label="Not complete" />}
                                    {l.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                          <p className="mt-2 text-xs text-muted">
                            Tracked automatically from the {s.pathName} lessons.
                            {s.planned ? ` ${s.planned} more ${s.pathName} topics are planned and not yet written.` : ""}
                          </p>
                        </>
                      ) : s.id === "projects" ? (
                        <>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {(s.items ?? []).map((item) => {
                              const slug = projectSlugFromHref(item.href);
                              const p = projects.find((x) => x.slug === slug);
                              const done = isProjectDone(slug, ticks);
                              const doneCount = p?.tasks.filter((_, i) => ticks[`project-${slug}-task-${i}`]).length ?? 0;
                              return (
                                <li key={item.href}>
                                  <Link href={item.href ?? "/projects"} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:border-primary/50 hover:bg-surface">
                                    {done ? <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Complete" /> : <Circle className="size-4 shrink-0 text-muted" aria-label="Not complete" />}
                                    <span className="flex-1">{item.label}</span>
                                    {p && (
                                      <span className="text-xs tabular-nums text-muted">
                                        {doneCount}/{p.tasks.length}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                          <p className="mt-2 text-xs text-muted">
                            Tracked automatically from the tasks you tick off on each project's own page — not from clicking here.
                          </p>
                        </>
                      ) : (
                        <Checklist className="mt-3" group={`roadmap:${s.id}`} items={s.items ?? []} />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button asChild size="sm">
                        <Link href={s.practice.href}>
                          Practise: {s.practice.label} <ArrowRight />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={s.project.href}>Project: {s.project.label}</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
