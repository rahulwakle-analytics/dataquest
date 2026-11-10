"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { recordCheck, useProgress } from "@/lib/progress";
import type { Lesson } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = { topicId: string; checks: Lesson["checks"] };

export function KnowledgeCheck({ topicId, checks }: Props) {
  const progress = useProgress();
  const saved = progress[topicId]?.checks ?? {};
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<Record<number, boolean>>({});

  return (
    <ol className="space-y-5">
      {checks.map((c, i) => {
        const solved = Boolean(saved[i]);
        const choice = solved ? c.answer : selected[i];
        return (
          <li key={i} className="rounded-2xl border border-border bg-card p-5">
            <fieldset disabled={solved}>
              <legend className="font-medium">
                <span className="mr-2 text-muted">{i + 1}.</span>
                {c.q}
              </legend>
              <div className="mt-4 grid gap-2">
                {c.options.map((opt, j) => {
                  const active = choice === j;
                  return (
                    <label
                      key={j}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                        active ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                        solved && active && "border-success bg-success/10",
                        solved && "cursor-default",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${topicId}-${i}`}
                        className="mt-0.5 accent-[rgb(var(--primary))]"
                        checked={active}
                        onChange={() => {
                          setSelected((s) => ({ ...s, [i]: j }));
                          setWrong((w) => ({ ...w, [i]: false }));
                        }}
                      />
                      <span className="font-mono text-[13px] leading-relaxed">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className="mt-4 flex flex-wrap items-center gap-3" aria-live="polite">
              {!solved && (
                <Button
                  size="sm"
                  disabled={selected[i] === undefined}
                  onClick={() => {
                    const ok = selected[i] === c.answer;
                    recordCheck(topicId, i, ok, checks.length);
                    setWrong((w) => ({ ...w, [i]: !ok }));
                  }}
                >
                  Check answer
                </Button>
              )}
              {solved && (
                <p className="flex items-start gap-2 text-sm text-success">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="font-semibold">Correct.</strong>{" "}
                    <span className="text-muted">{c.why}</span>
                  </span>
                </p>
              )}
              {!solved && wrong[i] && (
                <p className="flex items-center gap-2 text-sm text-danger">
                  <XCircle className="size-4 shrink-0" />
                  Not quite. Reread the explanation above and try another option.
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
