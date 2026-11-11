"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Scenario } from "@/content/career";
import { cn } from "@/lib/utils";

export function ScenarioExplorer({ scenarios }: { scenarios: Scenario[] }) {
  const [active, setActive] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const scenario = scenarios[active];
  const step = scenario.steps[stepIndex];
  const last = stepIndex === scenario.steps.length - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div role="tablist" aria-label="Workplace scenarios" className="grid grid-cols-2 border-b border-border lg:grid-cols-4">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            id={`scenario-tab-${s.id}`}
            aria-selected={active === i}
            aria-controls="scenario-panel"
            onClick={() => {
              setActive(i);
              setStepIndex(0);
            }}
            className={cn(
              "border-b-2 px-4 py-3.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
              active === i ? "border-primary bg-primary/10 text-foreground" : "border-transparent text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <span className="block text-xs text-muted">{s.who}</span>
            <span className="block font-medium">{s.title}</span>
          </button>
        ))}
      </div>

      <div id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${scenario.id}`} className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[240px_1fr]">
        <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Steps">
          {scenario.steps.map((s, i) => (
            <li key={s.label} className="shrink-0">
              <button
                type="button"
                aria-current={stepIndex === i ? "step" : undefined}
                onClick={() => setStepIndex(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  stepIndex === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    i <= stepIndex ? "bg-primary-strong text-white" : "bg-surface text-muted",
                  )}
                >
                  {i + 1}
                </span>
                <span className="whitespace-nowrap lg:whitespace-normal">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Step {stepIndex + 1} of {scenario.steps.length}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{step.label}</h3>
          <p className="mt-3 text-[17px] leading-relaxed">{step.body}</p>
          {step.points && (
            <ul className="mt-4 space-y-2">
              {step.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>
              <ArrowLeft /> Back
            </Button>
            {last ? (
              <Button
                size="sm"
                onClick={() => {
                  setActive((a) => (a + 1) % scenarios.length);
                  setStepIndex(0);
                }}
              >
                Next scenario <ArrowRight />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setStepIndex((i) => i + 1)}>
                Next: {scenario.steps[stepIndex + 1].label} <ArrowRight />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
