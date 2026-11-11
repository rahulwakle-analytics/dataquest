"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle, Zap } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { XP, challengeId, type SqlChallenge } from "@/content/sql-challenges";
import { isSolved, useProgress } from "@/lib/progress";

type Item = Pick<SqlChallenge, "slug" | "title" | "difficulty" | "topics" | "task">;

export function ChallengeList({ challenges }: { challenges: Item[] }) {
  const progress = useProgress();
  const solved = challenges.filter((c) => isSolved(progress, challengeId(c.slug), 0));
  const xp = solved.reduce((n, c) => n + XP[c.difficulty], 0);
  const total = challenges.reduce((n, c) => n + XP[c.difficulty], 0);
  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium">
            {solved.length} of {challenges.length} challenges solved
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Zap className="size-4 text-primary" aria-hidden="true" /> {xp} of {total} XP
          </span>
        </div>
        <Progress value={(solved.length / challenges.length) * 100} label="SQL challenges solved" />
        <p className="mt-3 text-xs text-muted">XP is counted once per challenge, only when your query passes its test cases. Saved in this browser.</p>
      </div>
      {(["Easy", "Medium", "Hard"] as const).map((d) => (
        <section key={d} className="mt-8" aria-labelledby={`level-${d}`}>
          <h2 id={`level-${d}`} className="mb-3 text-xl font-semibold tracking-tight">
            {d}
          </h2>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {challenges
              .filter((c) => c.difficulty === d)
              .map((c) => {
                const done = isSolved(progress, challengeId(c.slug), 0);
                return (
                  <li key={c.slug}>
                    <Link href={`/practice/sql/${c.slug}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                      {done ? <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Solved" /> : <Circle className="size-5 shrink-0 text-muted" aria-label="Not solved" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{c.title}</span>
                        <span className="block truncate text-sm text-muted">{c.topics.join(" · ")}</span>
                      </span>
                      <Badge variant={difficultyVariant(c.difficulty)} className="hidden sm:inline-flex">
                        {XP[c.difficulty]} XP
                      </Badge>
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
