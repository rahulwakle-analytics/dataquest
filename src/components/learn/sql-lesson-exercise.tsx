"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Loader2, Play, RotateCcw, Send, XCircle } from "lucide-react";
import { CodeBlock } from "@/components/learn/code-block";
import { DataTable } from "@/components/practice/sql-workspace";
import { hintsOf, SolutionToggle, useHints } from "@/components/practice/hints";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SqlLessonQuestion } from "@/content/types";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { schemaFor } from "@/lib/sql/databases";
import { checkQuery, getEngine, runQuery, SqlError, type CheckResult, type QueryResult } from "@/lib/sql/engine";

const SqlEditor = dynamic(() => import("@/components/practice/sql-editor"), {
  ssr: false,
  loading: () => <div className="flex h-[160px] items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted">Loading editor…</div>,
});

type Props = { topicId: string; index: number; question: SqlLessonQuestion };

/**
 * A SQL exercise embedded in a lesson, checked the same way the SQL Playground checks
 * challenges: the learner's query and the reference solution both run for real against DuckDB,
 * on two differently-sized datasets, and their results are compared — never a keyword match.
 */
export function SqlLessonExercise({ topicId, index, question }: Props) {
  const progress = useProgress();
  const solved = isSolved(progress, topicId, index);
  const database = question.database ?? "retail";
  const starter = question.starter ?? "SELECT\n  \nFROM ";
  const schema = schemaFor(database);

  const [code, setCode] = useState(starter);
  const codeRef = useRef(code);
  codeRef.current = code;
  const [engine, setEngine] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [busy, setBusy] = useState<null | "run" | "submit">(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<SqlError | null>(null);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const hints = useHints(hintsOf(question));

  const ensureEngine = useCallback(() => {
    if (engine !== "idle") return;
    setEngine("loading");
    getEngine(database).then(
      () => setEngine("ready"),
      () => setEngine("failed"),
    );
  }, [engine, database]);

  const execute = useCallback(
    async (mode: "run" | "submit") => {
      if (busy) return;
      setBusy(mode);
      setError(null);
      setCheck(null);
      try {
        if (mode === "run") {
          setResult(await runQuery(codeRef.current, database));
        } else {
          const outcome = await checkQuery(codeRef.current, question.solution, question.ordered, database);
          setResult(outcome.result);
          setCheck(outcome);
          if (outcome.pass) recordExercise(topicId, index);
        }
      } catch (e) {
        setResult(null);
        setError(e instanceof SqlError ? e : new SqlError(e instanceof Error ? e.message : String(e)));
      } finally {
        setBusy(null);
      }
    },
    [busy, database, question.solution, question.ordered, topicId, index],
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-5" onFocus={ensureEngine} onClick={ensureEngine}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{question.title}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={difficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-2 leading-relaxed text-muted">{question.prompt}</p>
      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        Expected columns, in this order:
        {question.columns.map((c) => (
          <code key={c} className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[12px]">
            {c}
          </code>
        ))}
      </p>

      <div className="mt-3">
        <SqlEditor value={code} onChange={setCode} onRun={() => void execute("run")} schema={schema} height="160px" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => void execute("run")} disabled={engine !== "ready" || busy !== null}>
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
            setResult(null);
            setError(null);
            setCheck(null);
          }}
        >
          <RotateCcw /> Reset
        </Button>
        {engine === "loading" && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Loader2 className="size-3 animate-spin" /> Loading database engine…
          </span>
        )}
        {hints.button}
        <SolutionToggle open={showSolution} onToggle={() => setShowSolution((s) => !s)} />
      </div>
      {hints.list}

      <div aria-live="polite" className="mt-3 space-y-3">
        {check && (
          <div className={`rounded-lg border p-3 ${check.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10"}`}>
            <p className="flex items-start gap-2 font-medium">
              {check.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
              {check.pass ? "Correct." : "Not yet."}
            </p>
            {!check.pass && <p className="mt-1 pl-6 text-sm leading-relaxed">{check.feedback}</p>}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
            <p className="font-medium text-danger">The query did not run</p>
            <pre className="mt-1.5 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed">{error.message}</pre>
            {error.hint && <p className="mt-1.5 text-sm leading-relaxed text-muted">{error.hint}</p>}
          </div>
        )}
        {result && !error && result.rows.length > 0 && <DataTable label="Query result" columns={result.columns} rows={result.rows} />}
      </div>

      {showSolution && (
        <div className="mt-4 animate-fade-up">
          <CodeBlock code={question.solution} lang="sql" />
          {question.explanation && <p className="mt-2 text-sm leading-relaxed text-muted">{question.explanation}</p>}
        </div>
      )}
    </article>
  );
}
