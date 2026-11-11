"use client";

import { Eye, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Hints are revealed one at a time, from a nudge to nearly the answer. */
export function useHints(hints: string[]) {
  const [shown, setShown] = useState(0);
  const button =
    hints.length > 0 && shown < hints.length ? (
      <Button variant="secondary" size="sm" onClick={() => setShown((n) => n + 1)}>
        <Lightbulb /> {shown === 0 ? "Show a hint" : `Next hint (${shown + 1} of ${hints.length})`}
      </Button>
    ) : null;
  const list =
    shown > 0 ? (
      <ol className="mt-4 space-y-2" aria-live="polite">
        {hints.slice(0, shown).map((h, i) => (
          <li key={i} className="animate-fade-up rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            <span className="font-medium">
              Hint {i + 1} of {hints.length}:{" "}
            </span>
            {h}
          </li>
        ))}
      </ol>
    ) : null;
  return { button, list, reset: () => setShown(0) };
}

export function SolutionToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Button variant="secondary" size="sm" aria-expanded={open} onClick={onToggle}>
      <Eye /> {open ? "Hide solution" : "Show solution"}
    </Button>
  );
}

export function hintsOf(q: { hints?: string[]; hint?: string }) {
  return q.hints ?? (q.hint ? [q.hint] : []);
}
