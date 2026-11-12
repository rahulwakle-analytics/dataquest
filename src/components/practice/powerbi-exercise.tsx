"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { challengeId, type PowerBiExercise } from "@/content/powerbi-practice";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function PowerBiExerciseCard({ exercise: q }: { exercise: PowerBiExercise }) {
  const progress = useProgress();
  const id = challengeId(q.slug);
  const solved = isSolved(progress, id, 0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const check = () => {
    if (picked === null) return;
    setChecked(true);
    if (picked === q.answer) recordExercise(id, 0);
  };

  return (
    <article id={q.slug} className="scroll-mt-20 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="violet">{q.category}</Badge>
        <div className="flex items-center gap-2">
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
          <Badge variant={difficultyVariant(q.difficulty)}>{q.difficulty}</Badge>
        </div>
      </div>
      <h3 className="mt-3 font-semibold">{q.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        <span className="font-medium text-foreground">Scenario. </span>
        {q.scenario}
      </p>
      <p className="mt-2 leading-relaxed">{q.prompt}</p>

      <fieldset className="mt-4 space-y-2">
        <legend className="sr-only">Answer options for {q.title}</legend>
        {q.options.map((opt, i) => {
          const isCorrect = checked && i === q.answer;
          const isWrongPick = checked && picked === i && i !== q.answer;
          return (
            <label
              key={i}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface/60 p-3 text-sm transition-colors",
                picked === i && !checked && "border-primary bg-primary/5",
                isCorrect && "border-success/40 bg-success/10",
                isWrongPick && "border-danger/40 bg-danger/10",
              )}
            >
              <input type="radio" name={`${q.slug}-answer`} className="mt-0.5 accent-[rgb(var(--primary))]" checked={picked === i} onChange={() => !checked && setPicked(i)} disabled={checked} />
              <span className="flex-1">{opt}</span>
              {isCorrect && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Correct answer" />}
              {isWrongPick && <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Your answer" />}
            </label>
          );
        })}
      </fieldset>

      <div className="mt-4 flex flex-wrap gap-2">
        {!checked ? (
          <Button size="sm" onClick={check} disabled={picked === null}>
            Check answer
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setChecked(false);
              setPicked(null);
            }}
          >
            Try another option
          </Button>
        )}
      </div>

      {checked && (
        <div className={cn("mt-4 animate-fade-up rounded-lg border p-4 text-sm", picked === q.answer ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10")}>
          <p className="flex items-start gap-2 font-medium">
            {picked === q.answer ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
            {picked === q.answer ? "Correct." : "Not quite."}
          </p>
          <p className="mt-2 pl-6 leading-relaxed text-muted">{q.explanation}</p>
        </div>
      )}
    </article>
  );
}
