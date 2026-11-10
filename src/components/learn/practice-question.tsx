"use client";

import { Eye, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/types";
import { CodeBlock } from "./code-block";

type Props = { index: number; lang: string; question: Lesson["practice"][number] };

export function PracticeQuestion({ index, lang, question }: Props) {
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [draft, setDraft] = useState("");
  const isCode = lang === "sql" || lang === "python" || lang === "excel";
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
        Drafts are not checked automatically yet. Compare your attempt with the solution when you are ready.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" aria-expanded={hint} onClick={() => setHint((h) => !h)}>
          <Lightbulb /> {hint ? "Hide hint" : "Show hint"}
        </Button>
        <Button variant="secondary" size="sm" aria-expanded={solution} onClick={() => setSolution((s) => !s)}>
          <Eye /> {solution ? "Hide solution" : "Show solution"}
        </Button>
      </div>
      {hint && (
        <p className="mt-4 animate-fade-up rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
          <span className="font-medium">Hint: </span>
          {question.hint}
        </p>
      )}
      {solution &&
        (isCode ? (
          <CodeBlock code={question.solution} lang={lang} className="mt-4 animate-fade-up" />
        ) : (
          <p className="mt-4 animate-fade-up rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">
            {question.solution}
          </p>
        ))}
    </article>
  );
}
