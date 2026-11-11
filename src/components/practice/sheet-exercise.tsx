"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/learn/code-block";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormulaQuestion } from "@/content/types";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { checkFormula, type CheckResult } from "@/lib/sheet/check";
import { syntaxProblem } from "@/lib/sheet/engine";
import { hintsOf, SolutionToggle, useHints } from "./hints";
import { FormulaBar, SheetGrid } from "./sheet-grid";

type Props = { topicId: string; index: number; question: FormulaQuestion };

export function SheetExercise({ topicId, index, question: q }: Props) {
  const progress = useProgress();
  const solved = isSolved(progress, topicId, index);
  const [input, setInput] = useState("");
  const [showFormulas, setShowFormulas] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [solution, setSolution] = useState(false);
  const hints = useHints(hintsOf(q));

  const trimmed = input.trim();
  const problem = trimmed ? syntaxProblem(trimmed) : null;
  const live = trimmed && !problem ? trimmed : null;
  const id = `fx-${index}`;

  const check = () => {
    if (!trimmed) return;
    const res = checkFormula(q, trimmed);
    setResult(res);
    if (res.pass) recordExercise(topicId, index);
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{q.title}</h3>
        <div className="flex items-center gap-2">
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
          <Badge variant={difficultyVariant(q.difficulty)}>{q.difficulty}</Badge>
        </div>
      </div>
      <p className="mt-2 leading-relaxed text-muted">{q.prompt}</p>
      {q.sheet.tables?.map((t) => (
        <p key={t.name} className="mt-2 text-xs text-muted">
          Table <span className="font-mono font-semibold text-foreground">{t.name}</span> covers {t.ref}.
        </p>
      ))}

      <div className="mt-4 space-y-2">
        <FormulaBar
          id={id}
          cell={q.target}
          value={input}
          onChange={(v) => {
            setInput(v);
            setResult(null);
          }}
          onEnter={check}
          problem={problem}
        />
        <SheetGrid spec={q.sheet} formula={live} target={q.target} fill={q.fill} showFormulas={showFormulas} caption={`Spreadsheet for ${q.title}`} />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>{q.fill ? `Your formula in ${q.target} is copied to ${q.fill}.` : `Your formula goes in ${q.target}.`}</span>
          {q.fill && (
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={showFormulas} onChange={(e) => setShowFormulas(e.target.checked)} className="accent-[rgb(var(--primary))]" />
              Show formulas
            </label>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={check} disabled={!trimmed}>
          Check answer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        >
          <RotateCcw /> Reset
        </Button>
        {hints.button}
        <SolutionToggle open={solution} onToggle={() => setSolution((s) => !s)} />
      </div>

      <div aria-live="polite">
        {result && (
          <div className={`mt-4 animate-fade-up rounded-lg border p-4 text-sm ${result.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10"}`}>
            <p className="flex items-start gap-2 font-medium">
              {result.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
              {result.pass ? "Correct. Your formula passed every test case." : "Not yet."}
            </p>
            {!result.pass && <p className="mt-2 pl-6">{result.feedback}</p>}
            {result.tests.length > 0 && (
              <ul className="mt-3 space-y-1 pl-6">
                {result.tests.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {t.pass ? <CheckCircle2 className="size-3.5 text-success" aria-label="Passed" /> : <XCircle className="size-3.5 text-danger" aria-label="Failed" />}
                    <span className="text-muted">
                      Test {i + 1}: {t.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {result.pass && q.explanation && <p className="mt-3 pl-6 text-muted">{q.explanation}</p>}
          </div>
        )}
      </div>

      {hints.list}
      {solution && (
        <div className="mt-4 animate-fade-up">
          <CodeBlock code={q.solution} lang="excel" />
          {q.explanation && <p className="mt-2 text-sm leading-relaxed text-muted">{q.explanation}</p>}
        </div>
      )}
    </article>
  );
}
