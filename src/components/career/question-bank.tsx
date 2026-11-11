"use client";

import { useState } from "react";
import { Reveal } from "@/components/career/reveal";
import type { InterviewQuestion } from "@/content/career";
import { cn } from "@/lib/utils";

export function Points({ points }: { points: string[] }) {
  return (
    <ul className="space-y-1.5 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  );
}

export function QuestionBank({ questions }: { questions: InterviewQuestion[] }) {
  const categories = ["All", ...Array.from(new Set(questions.map((q) => q.category)))];
  const [cat, setCat] = useState("All");
  const shown = questions.filter((q) => cat === "All" || q.category === cat);
  return (
    <div>
      <div role="group" aria-label="Filter questions by category" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              cat === c ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted" aria-live="polite">
        Showing {shown.length} of {questions.length} questions
      </p>
      <ul className="mt-3 space-y-3">
        {shown.map((q) => (
          <li key={q.q} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{q.category}</p>
            <p className="mt-1 font-medium">{q.q}</p>
            <div className="mt-3">
              <Reveal label="what a good answer covers">
                <Points points={q.points} />
              </Reveal>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
