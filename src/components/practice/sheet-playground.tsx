"use client";

import { useState } from "react";
import type { Playground } from "@/content/types";
import { syntaxProblem } from "@/lib/sheet/engine";
import { cn } from "@/lib/utils";
import { FormulaBar, SheetGrid } from "./sheet-grid";

export function SheetPlayground({ playground: p }: { playground: Playground }) {
  const [input, setInput] = useState(p.initial);
  const [showFormulas, setShowFormulas] = useState(false);
  const trimmed = input.trim();
  const problem = trimmed ? syntaxProblem(trimmed) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">{p.title}</h3>
      <p className="mt-1.5 text-muted">{p.intro}</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Formulas to try">
        {p.tryThese.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setInput(f)}
            aria-pressed={trimmed === f}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              trimmed === f ? "border-primary bg-primary/10" : "border-border text-muted hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <FormulaBar id="playground-fx" cell={p.target} value={input} onChange={setInput} problem={problem} />
        <SheetGrid spec={p.sheet} formula={trimmed && !problem ? trimmed : null} target={p.target} fill={p.fill} showFormulas={showFormulas} caption={p.title} />
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={showFormulas} onChange={(e) => setShowFormulas(e.target.checked)} className="accent-[rgb(var(--primary))]" />
          Show formulas in {p.fill}
        </label>
      </div>
    </div>
  );
}
