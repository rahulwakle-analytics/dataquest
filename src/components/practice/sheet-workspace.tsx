"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Send, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/learn/code-block";
import { SolutionToggle, useHints } from "@/components/practice/hints";
import { EditableGrid } from "@/components/practice/sheet-editor";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { challengeId, XP, type SheetChallenge } from "@/content/sheet-challenges";
import { checkTargets, type PlaygroundCheck } from "@/lib/sheet/playground-check";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const panel = "rounded-2xl border border-border bg-card";

export function SheetWorkspace({ challenge, next }: { challenge: SheetChallenge; next?: { slug: string; title: string } }) {
  const progress = useProgress();
  const id = challengeId(challenge.slug);
  const solved = isSolved(progress, id, 0);

  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
  const [result, setResult] = useState<PlaygroundCheck | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const hints = useHints(challenge.hints);

  const setCell = (addr: string, value: string) => {
    setOverrides((m) => {
      const next = new Map(m);
      next.set(addr, value);
      return next;
    });
    setResult(null);
  };

  const check = () => {
    const outcome = checkTargets(challenge.sheet, challenge.targets, overrides, challenge.solution);
    setResult(outcome);
    if (outcome.pass) recordExercise(id, 0); // stored once, so XP cannot be earned twice
  };

  const reset = () => {
    setOverrides(new Map());
    setResult(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <section aria-labelledby="problem-h" className={cn(panel, "p-5")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
          <Badge variant="primary">
            <Zap className="size-3" /> {XP[challenge.difficulty]} XP
          </Badge>
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
        </div>
        <h1 id="problem-h" className="mt-3 text-2xl font-semibold tracking-tight">
          {challenge.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">Scenario. </span>
          {challenge.scenario}
        </p>
        <p className="mt-3 leading-relaxed">{challenge.task}</p>
        <h2 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Cells to fill</h2>
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {challenge.targets.map((t) => (
            <code key={t} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[12.5px]">
              {t}
            </code>
          ))}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {hints.button}
          <SolutionToggle open={showSolution} onToggle={() => setShowSolution((s) => !s)} />
        </div>
        {hints.list}
        {showSolution && (
          <div className="mt-4 animate-fade-up space-y-2">
            {Object.entries(challenge.solution).map(([addr, f]) => (
              <CodeBlock key={addr} code={`${addr}: ${f}`} lang="excel" />
            ))}
            <p className="mt-2 text-sm leading-relaxed text-muted">{challenge.explanation}</p>
          </div>
        )}
      </section>

      <section aria-labelledby="sheet-h" className={cn(panel, "min-w-0 p-5")}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="sheet-h" className="font-semibold">
            Spreadsheet
          </h2>
          <span className="text-xs text-muted">Highlighted cells are yours to fill. Everything else is sample data.</span>
        </div>
        <EditableGrid spec={challenge.sheet} targets={challenge.targets} overrides={overrides} onChange={setCell} caption={challenge.title} />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={check}>
            <Send /> Check answer
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw /> Reset
          </Button>
        </div>

        <div aria-live="polite" className="mt-4">
          {result && (
            <div className={cn("rounded-lg border p-4", result.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10")}>
              <p className="flex items-start gap-2 font-medium">
                {result.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
                {result.pass ? "Correct. Every cell matches the expected result." : "Not yet."}
              </p>
              {!result.pass && <p className="mt-1 pl-6 text-sm leading-relaxed">{result.feedback}</p>}
              <ul className="mt-2 space-y-1 pl-6 text-sm">
                {result.targets.map((t) => (
                  <li key={t.addr} className="flex items-center gap-2">
                    {t.pass ? <CheckCircle2 className="size-3.5 text-success" aria-label="Correct" /> : <XCircle className="size-3.5 text-danger" aria-label="Incorrect" />}
                    {t.addr}
                  </li>
                ))}
              </ul>
              {result.pass && (
                <div className="mt-3 flex flex-wrap items-center gap-3 pl-6">
                  <span className="text-sm text-muted">{XP[challenge.difficulty]} XP counted once for this challenge.</span>
                  {next && (
                    <Button asChild size="sm">
                      <Link href={`/practice/excel/${next.slug}`}>
                        Next: {next.title} <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
