"use client";

import { ArrowRight, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Points } from "@/components/career/question-bank";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InterviewQuestion } from "@/content/career";

const LENGTH = 5;
type Rating = "confident" | "needs work";

function pick(questions: InterviewQuestion[]): InterviewQuestion[] {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, LENGTH);
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** A timed, self-assessed practice round. No recording and no automated scoring. */
export function MockInterview({ questions }: { questions: InterviewQuestion[] }) {
  const [round, setRound] = useState<InterviewQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<{ q: InterviewQuestion; rating: Rating; seconds: number }[]>([]);

  const running = round !== null && index < round.length && !revealed;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, index]);

  const start = () => {
    setRound(pick(questions));
    setIndex(0);
    setSeconds(0);
    setNotes("");
    setRevealed(false);
    setRatings([]);
  };

  if (!round) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <h3 className="text-lg font-semibold">A five-question practice round</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
          You get five questions drawn at random from the bank. Answer each aloud as you would in an interview, then reveal what a good answer covers and rate yourself. Nothing is recorded or scored for you.
        </p>
        <Button className="mt-5" onClick={start}>
          <Play /> Start mock interview
        </Button>
      </div>
    );
  }

  if (index >= round.length) {
    const confident = ratings.filter((r) => r.rating === "confident").length;
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8" aria-live="polite">
        <h3 className="text-lg font-semibold">Round complete</h3>
        <p className="mt-1 text-sm text-muted">
          You rated yourself confident on {confident} of {ratings.length} questions.
        </p>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {ratings.map((r) => (
            <li key={r.q.q} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span className="min-w-0 flex-1">{r.q.q}</span>
              <span className="tabular-nums text-muted">{clock(r.seconds)}</span>
              <Badge variant={r.rating === "confident" ? "success" : "warning"}>{r.rating === "confident" ? "Confident" : "Needs work"}</Badge>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Revisit the ones marked “Needs work” in the question bank, then run another round.</p>
        <Button className="mt-5" onClick={start}>
          <RotateCcw /> Start another round
        </Button>
      </div>
    );
  }

  const q = round[index];
  const rate = (rating: Rating) => {
    setRatings((r) => [...r, { q, rating, seconds }]);
    setIndex((i) => i + 1);
    setSeconds(0);
    setNotes("");
    setRevealed(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Question {index + 1} of {round.length}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-muted" role="timer" aria-label="Time on this question">
          <Timer className="size-4" aria-hidden="true" /> {clock(seconds)}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{q.category}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{q.q}</h3>

      <label htmlFor="mock-notes" className="mt-5 block text-xs font-medium uppercase tracking-wide text-muted">
        Notes (optional)
      </label>
      <textarea
        id="mock-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Answer aloud. Jot key points here if it helps."
        className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      {!revealed ? (
        <Button className="mt-4" onClick={() => setRevealed(true)}>
          I have answered. Show what a good answer covers
        </Button>
      ) : (
        <div className="mt-4 animate-fade-up" aria-live="polite">
          <Points points={q.points} />
          <p className="mt-4 text-sm font-medium">How did your answer compare?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => rate("confident")}>
              Confident <ArrowRight />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => rate("needs work")}>
              Needs work <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
