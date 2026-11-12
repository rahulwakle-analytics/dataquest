"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Check, Copy, Loader2, Play, RotateCcw, Send, XCircle, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeBlock } from "@/components/learn/code-block";
import { SolutionToggle, useHints } from "@/components/practice/hints";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { challengeId, XP, type PythonChallenge } from "@/content/python-challenges";
import { recordView } from "@/lib/challenge-meta";
import { getEngine, runAndCheck, TIME_LIMIT_MS } from "@/lib/python/engine";
import { checkChallenge, type ChallengeCheckResult } from "@/lib/python/check";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const PythonEditor = dynamic(() => import("./python-editor"), {
  ssr: false,
  loading: () => <div className="flex h-[260px] items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted">Loading editor…</div>,
});

type Props = { challenge: PythonChallenge; next?: { slug: string; title: string } };
const panel = "rounded-2xl border border-border bg-card";

export function PythonWorkspace({ challenge, next }: Props) {
  const progress = useProgress();
  const id = challengeId(challenge.slug);
  const solved = isSolved(progress, id, 0);
  const starter = challenge.starter;

  const [code, setCode] = useState(starter);
  const codeRef = useRef(code);
  codeRef.current = code;
  const [engine, setEngine] = useState<"loading" | "ready" | "failed">("loading");
  const [busy, setBusy] = useState<null | "run" | "submit">(null);
  const [runOutput, setRunOutput] = useState<{ stdout: string; value: unknown } | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [check, setCheck] = useState<ChallengeCheckResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showData, setShowData] = useState(false);
  const [copied, setCopied] = useState(false);
  const hints = useHints(challenge.hints);

  useEffect(() => {
    recordView(id);
  }, [id]);

  useEffect(() => {
    let live = true;
    setEngine("loading");
    getEngine().then(
      () => live && setEngine("ready"),
      () => live && setEngine("failed"),
    );
    return () => {
      live = false;
    };
  }, []);

  const execute = useCallback(
    async (mode: "run" | "submit") => {
      if (busy) return;
      setBusy(mode);
      setRunError(null);
      setCheck(null);
      try {
        const pyodide = await getEngine();
        if (mode === "run") {
          const outcome = await runAndCheck(pyodide, challenge.setupMain, codeRef.current, challenge.checkExpr);
          if (outcome.ok) {
            setRunOutput({ stdout: outcome.stdout, value: outcome.value });
          } else {
            setRunOutput(null);
            setRunError(outcome.error);
          }
        } else {
          const outcome = await checkChallenge(pyodide, challenge, codeRef.current);
          setCheck(outcome);
          setRunOutput(outcome.stdout ? { stdout: outcome.stdout, value: undefined } : null);
          if (outcome.pass) recordExercise(id, 0); // stored once, so XP cannot be earned twice
        }
        setEngine("ready");
      } catch (e) {
        setRunOutput(null);
        setRunError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(null);
      }
    },
    [busy, challenge, id],
  );
  const run = useCallback(() => void execute("run"), [execute]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]">
      {/* Left: problem */}
      <section aria-labelledby="problem-h" className={cn(panel, "p-5")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
          <Badge variant="primary">
            <Zap className="size-3" /> {XP[challenge.difficulty]} XP
          </Badge>
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
        </div>
        <h1 id="problem-h" className="mt-3 text-2xl font-semibold tracking-tight">
          {challenge.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">Scenario. </span>
          {challenge.scenario}
        </p>
        <p className="mt-3 leading-relaxed">{challenge.task}</p>
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {challenge.topics.map((t) => (
            <code key={t} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[12.5px]">
              {t}
            </code>
          ))}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {hints.button}
          <SolutionToggle open={showSolution} onToggle={() => setShowSolution((s) => !s)} />
        </div>
        {hints.list}
        {showSolution && (
          <div className="mt-4 animate-fade-up">
            <CodeBlock code={challenge.solution} lang="python" />
            <p className="mt-2 text-sm leading-relaxed text-muted">{challenge.explanation}</p>
          </div>
        )}
      </section>

      {/* Centre: editor */}
      <section aria-labelledby="editor-h" className={cn(panel, "p-5")}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="editor-h" className="font-semibold">
            Python editor
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted" role="status">
            {engine === "loading" && (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Loading Python (pandas)…
              </>
            )}
            {engine === "ready" && (
              <>
                <span className="size-2 rounded-full bg-success" aria-hidden="true" /> Pyodide ready
              </>
            )}
            {engine === "failed" && <span className="text-danger">Engine failed to load. Reload the page.</span>}
          </span>
        </div>
        <PythonEditor value={code} onChange={setCode} onRun={run} />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={run} disabled={engine !== "ready" || busy !== null}>
            {busy === "run" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
          <Button size="sm" onClick={() => void execute("submit")} disabled={engine !== "ready" || busy !== null}>
            {busy === "submit" ? <Loader2 className="animate-spin" /> : <Send />} Submit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCode(starter);
              setRunOutput(null);
              setRunError(null);
              setCheck(null);
            }}
          >
            <RotateCcw /> Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(codeRef.current);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy code"}
          </Button>
          <span className="ml-auto hidden text-xs text-muted sm:block">Ctrl or ⌘ + Enter to run</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Runs in your browser on Pyodide, a real Python (CPython) interpreter with numpy and pandas, stopped if it runs over {TIME_LIMIT_MS / 1000} seconds.
        </p>
      </section>

      {/* Right: starting data */}
      <section aria-labelledby="data-h" className={cn(panel, "min-w-0 p-5")}>
        <div className="flex items-center justify-between gap-2">
          <h2 id="data-h" className="font-semibold">
            Starting data
          </h2>
          <button type="button" onClick={() => setShowData((s) => !s)} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            {showData ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          This is the code that runs just before yours, defining the variables the task describes. Your submission is also checked against a second, differently-sized dataset with the same
          variable names — so an answer that only works for this one won&apos;t pass.
        </p>
        {showData && (
          <div className="mt-3">
            <CodeBlock code={challenge.setupMain} lang="python" />
          </div>
        )}
      </section>

      {/* Bottom: output */}
      <section aria-labelledby="output-h" className={cn(panel, "p-5 lg:col-span-3")}>
        <h2 id="output-h" className="font-semibold">
          Output
        </h2>
        <div aria-live="polite" className="mt-3 space-y-3">
          {check && (
            <div className={cn("rounded-lg border p-4", check.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10")}>
              <p className="flex items-start gap-2 font-medium">
                {check.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
                {check.pass ? "Correct. Your code passed both test cases." : "Not yet."}
              </p>
              {!check.pass && <p className="mt-1 pl-6 text-sm leading-relaxed">{check.feedback}</p>}
              <ul className="mt-2 space-y-1 pl-6 text-sm">
                {check.tests.map((t) => (
                  <li key={t.name} className="flex items-center gap-2">
                    {t.pass ? <CheckCircle2 className="size-3.5 text-success" aria-label="Passed" /> : <XCircle className="size-3.5 text-danger" aria-label="Failed" />}
                    {t.name}
                  </li>
                ))}
              </ul>
              {check.pass && (
                <div className="mt-3 flex flex-wrap items-center gap-3 pl-6">
                  <span className="text-sm text-muted">{XP[challenge.difficulty]} XP counted once for this challenge.</span>
                  {next && (
                    <Button asChild size="sm">
                      <Link href={`/practice/python/${next.slug}`}>
                        Next: {next.title} <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {runError && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
              <p className="flex items-start gap-2 font-medium">
                <XCircle className="mt-0.5 size-4 shrink-0 text-danger" /> The code did not run
              </p>
              <pre className="mt-2 whitespace-pre-wrap pl-6 font-mono text-[12.5px] leading-relaxed">{runError}</pre>
            </div>
          )}
          {runOutput?.stdout && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Printed output</p>
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 font-mono text-[12.5px] leading-relaxed">{runOutput.stdout}</pre>
            </div>
          )}
          {runOutput && runOutput.value !== undefined && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Checked expression ({challenge.checkExpr})</p>
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 font-mono text-[12.5px] leading-relaxed">{JSON.stringify(runOutput.value, null, 2)}</pre>
            </div>
          )}
          {!check && !runError && !runOutput && (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">Run your code to see its result here, or Submit to check it against the test cases.</p>
          )}
        </div>
      </section>
    </div>
  );
}
