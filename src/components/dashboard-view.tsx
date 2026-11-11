"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, ListChecks, Target } from "lucide-react";
import { useState } from "react";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { isComplete, resetProgress, useProgress } from "@/lib/progress";

export type DashboardPath = {
  slug: string;
  name: string;
  totalTopics: number;
  topics: { id: string; title: string; checks: number; exercises: { title: string; checked: boolean }[] }[];
};

type Event = { at: string; kind: "topic" | "exercise"; label: string; path: string; href: string };

const fmtDate = (iso: string) => new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function DashboardView({ paths }: { paths: DashboardPath[] }) {
  const progress = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const events: Event[] = [];
  let topicsDone = 0;
  let exercisesDone = 0;
  let checksDone = 0;
  let exercisesTotal = 0;
  for (const p of paths) {
    for (const t of p.topics) {
      const st = progress[t.id];
      exercisesTotal += t.exercises.filter((e) => e.checked).length;
      if (!st) continue;
      checksDone += Object.values(st.checks ?? {}).filter(Boolean).length;
      if (st.completedAt) {
        topicsDone++;
        events.push({ at: st.completedAt, kind: "topic", label: t.title, path: p.name, href: `/paths/${t.id}` });
      }
      for (const [i, at] of Object.entries(st.exercises ?? {})) {
        exercisesDone++;
        events.push({ at, kind: "exercise", label: t.exercises[Number(i)]?.title ?? "Exercise", path: `${p.name} · ${t.title}`, href: `/paths/${t.id}#practice` });
      }
    }
  }
  events.sort((a, b) => b.at.localeCompare(a.at));
  const started = events.length > 0 || checksDone > 0;

  const pathRows = paths.map((p) => {
    const done = p.topics.filter((t) => isComplete(progress, t.id)).length;
    const active = p.topics.some((t) => progress[t.id]);
    const next = p.topics.find((t) => !isComplete(progress, t.id));
    return { ...p, done, active, next };
  });
  const resume = pathRows.filter((p) => p.active && p.next);

  const stats = [
    { icon: BookOpenCheck, label: "Topics completed", value: String(topicsDone), tone: "text-success" },
    { icon: Target, label: "Exercises solved", value: `${exercisesDone} / ${exercisesTotal}`, tone: "text-primary" },
    { icon: ListChecks, label: "Knowledge checks correct", value: String(checksDone), tone: "text-violet" },
  ];

  return (
    <div className="container py-10 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight">Your progress</h1>
          <p className="mt-2 max-w-xl text-muted">Saved in this browser. Accounts that sync progress across devices are in development.</p>
        </div>
      </header>

      {!started ? (
        <Card className="mt-10 p-10 text-center">
          <h2 className="text-xl font-semibold">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Solve a practice exercise or pass a knowledge check and it will show up here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/paths/excel/formulas-and-cell-references">
                Start with Excel formulas <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/paths">Browse learning paths</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <Card key={s.label} className="p-5">
                <s.icon className={`size-5 ${s.tone}`} aria-hidden="true" />
                <dd className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{s.value}</dd>
                <dt className="text-sm text-muted">{s.label}</dt>
              </Card>
            ))}
          </dl>

          {resume.length > 0 && (
            <section className="mt-10" aria-labelledby="continue">
              <h2 id="continue" className="text-xl font-semibold tracking-tight">
                Continue learning
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {resume.map((p) => (
                  <Link key={p.slug} href={`/paths/${p.next!.id}`} className="group focus-visible:outline-none">
                    <Card className="flex items-center gap-4 p-5 transition-colors group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                      <ToolIcon tool={p.slug} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-muted">{p.name}</span>
                        <span className="block truncate font-medium">{p.next!.title}</span>
                      </span>
                      <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="mt-10" aria-labelledby="paths">
        <h2 id="paths" className="text-xl font-semibold tracking-tight">
          Learning paths
        </h2>
        <Card className="mt-4 divide-y divide-border">
          {pathRows.map((p) => (
            <div key={p.slug} className="grid items-center gap-3 p-5 sm:grid-cols-[200px_1fr_auto]">
              <Link href={`/paths/${p.slug}`} className="flex items-center gap-3 font-medium hover:text-primary">
                <ToolIcon tool={p.slug} className="size-9" />
                {p.name}
              </Link>
              <Progress value={(p.topics.length ? p.done / p.topics.length : 0) * 100} label={`${p.name} progress`} />
              <span className="text-sm tabular-nums text-muted">
                {p.done} of {p.topics.length} lessons
              </span>
            </div>
          ))}
        </Card>
      </section>

      {started && (
        <section className="mt-10" aria-labelledby="history">
          <h2 id="history" className="text-xl font-semibold tracking-tight">
            Learning history
          </h2>
          {events.length === 0 ? (
            <p className="mt-3 text-muted">Knowledge checks answered so far: {checksDone}. Complete a topic or solve an exercise to start your history.</p>
          ) : (
            <Card className="mt-4">
              <ol className="divide-y divide-border">
                {events.slice(0, 30).map((e, i) => (
                  <li key={i}>
                    <Link href={e.href} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface">
                      <CheckCircle2 className={`size-4 shrink-0 ${e.kind === "topic" ? "text-success" : "text-primary"}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {e.kind === "topic" ? "Completed topic: " : "Solved: "}
                          {e.label}
                        </span>
                        <span className="block truncate text-xs text-muted">{e.path}</span>
                      </span>
                      <time dateTime={e.at} className="shrink-0 text-xs text-muted">
                        {fmtDate(e.at)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ol>
            </Card>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {confirmReset ? (
              <>
                <span className="text-muted">Delete all progress saved in this browser? This cannot be undone.</span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-danger/50 text-danger"
                  onClick={() => {
                    resetProgress();
                    setConfirmReset(false);
                  }}
                >
                  Yes, delete it
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
                Reset progress
              </Button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
