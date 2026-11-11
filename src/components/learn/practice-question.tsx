"use client";

import { useState } from "react";
import { hintsOf, SolutionToggle, useHints } from "@/components/practice/hints";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import type { TextQuestion } from "@/content/types";
import { CodeBlock } from "./code-block";

type Props = { index: number; lang: string; question: TextQuestion };

/** A question with a written answer: attempt it, then compare with the model solution. */
export function PracticeQuestion({ index, lang, question }: Props) {
  const [solution, setSolution] = useState(false);
  const [draft, setDraft] = useState("");
  const hints = useHints(hintsOf(question));
  const isCode = (lang === "sql" || lang === "python");
  const id = `practice-${index}`;

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{question.title}</h3>
        <Badge variant={difficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
      </div>
      <p className="mt-2 leading-relaxed text-muted">{question.prompt}</p>

      <label htmlFor={id} className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Your answer
      </label>
      <textarea
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={isCode ? 4 : 3}
        spellCheck={false}
        placeholder={isCode ? "Write your attempt here before you look at the solution" : "Write your answer here before you look at the solution"}
        className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-[13px] leading-relaxed placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <p className="mt-1.5 text-xs text-muted">
        This question is not checked automatically. Compare your attempt with the solution when you are ready.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {hints.button}
        <SolutionToggle open={solution} onToggle={() => setSolution((s) => !s)} />
      </div>
      {hints.list}
      {solution && (
        <div className="mt-4 animate-fade-up">
          {isCode ? (
            <CodeBlock code={question.solution} lang={lang} />
          ) : (
            <p className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">{question.solution}</p>
          )}
          {question.explanation && <p className="mt-2 text-sm leading-relaxed text-muted">{question.explanation}</p>}
        </div>
      )}
    </article>
  );
}
