"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Check, Copy, Loader2, Play, RotateCcw, Send, Table2, XCircle, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeBlock } from "@/components/learn/code-block";
import { SolutionToggle, useHints } from "@/components/practice/hints";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XP, challengeId, type SqlChallenge } from "@/content/sql-challenges";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { DATABASES } from "@/lib/sql/databases";
import { checkQuery, getEngine, ROW_LIMIT, runQuery, SqlError, TIME_LIMIT_MS, type Cell, type CheckResult, type QueryResult } from "@/lib/sql/engine";
import { cn } from "@/lib/utils";

const SqlEditor = dynamic(() => import("./sql-editor"), {
  ssr: false,
  loading: () => <div className="flex h-[260px] items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted">Loading editor…</div>,
});

export type TablePreview = { name: string; rows: number; columns: string[]; preview: Record<string, Cell>[] };
type Props = { challenge: SqlChallenge; tables: TablePreview[]; next?: { slug: string; title: string } };

const fmt = (v: Cell) => (v === null ? "NULL" : typeof v === "number" && !Number.isInteger(v) ? String(Math.round(v * 100) / 100) : String(v));
const panel = "rounded-2xl border border-border bg-card";

/** Infers a display type per column from the sampled preview rows. Preview-only; not a schema fetch. */
function inferColumnTypes(columns: string[], preview: Record<string, Cell>[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of columns) {
    const sample = preview.find((r) => r[c] !== null && r[c] !== undefined)?.[c];
    out[c] = typeof sample === "number" ? (Number.isInteger(sample) ? "integer" : "decimal") : typeof sample === "boolean" ? "boolean" : "text";
  }
  return out;
}

/** Generic template queries, filled in with the active table's name and first two columns. */
function sampleQueriesFor(t: TablePreview): { label: string; sql: string }[] {
  const [a, b] = t.columns;
  return [
    { label: "Preview rows", sql: `SELECT *\nFROM ${t.name}\nLIMIT 10;` },
    { label: "Count rows", sql: `SELECT COUNT(*) AS row_count\nFROM ${t.name};` },
    ...(a ? [{ label: `Distinct ${a}`, sql: `SELECT DISTINCT ${a}\nFROM ${t.name}\nORDER BY ${a};` }] : []),
    ...(a && b ? [{ label: `Group by ${a}`, sql: `SELECT ${a}, COUNT(*) AS n\nFROM ${t.name}\nGROUP BY ${a}\nORDER BY n DESC;` }] : []),
  ];
}

function DataTable({ columns, rows, label }: { columns: string[]; rows: Cell[][]; label: string }) {
  return (
    <div tabIndex={0} role="region" aria-label={label} className="max-h-[320px] overflow-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <table className="w-full border-collapse text-left font-mono text-[12.5px]">
        <thead className="sticky top-0 bg-surface text-muted">
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((v, j) => (
                <td key={j} className={cn("whitespace-nowrap px-3 py-1.5", typeof v === "number" && "text-right tabular-nums", v === null && "text-muted")}>
                  {fmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SqlWorkspace({ challenge, tables, next }: Props) {
  const progress = useProgress();
  const id = challengeId(challenge.slug);
  const solved = isSolved(progress, id, 0);
  const starter = challenge.starter ?? "SELECT\n  \nFROM ";
  const database = challenge.database ?? "retail";

  const [code, setCode] = useState(starter);
  const codeRef = useRef(code);
  codeRef.current = code;
  const [engine, setEngine] = useState<"loading" | "ready" | "failed">("loading");
  const [busy, setBusy] = useState<null | "run" | "submit">(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<SqlError | null>(null);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [table, setTable] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const hints = useHints(challenge.hints);

  useEffect(() => {
    let live = true;
    setEngine("loading");
    getEngine(database).then(
      () => live && setEngine("ready"),
      () => live && setEngine("failed"),
    );
    return () => {
      live = false;
    };
  }, [database]);

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
          const outcome = await checkQuery(codeRef.current, challenge.solution, challenge.ordered, database);
          setResult(outcome.result);
          setCheck(outcome);
          if (outcome.pass) recordExercise(id, 0); // stored once, so XP cannot be earned twice
        }
        setEngine("ready");
      } catch (e) {
        setResult(null);
        setError(e instanceof SqlError ? e : new SqlError(e instanceof Error ? e.message : String(e)));
      } finally {
        setBusy(null);
      }
    },
    [busy, challenge.solution, challenge.ordered, id, database],
  );
  const run = useCallback(() => void execute("run"), [execute]);

  const schema = Object.fromEntries(tables.map((t) => [t.name, t.columns]));
  const active = tables[table];

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
        <h2 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Expected columns, in this order</h2>
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {challenge.columns.map((c) => (
            <code key={c} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[12.5px]">
              {c}
            </code>
          ))}
        </p>
        <p className="mt-2 text-xs text-muted">
          {challenge.ordered ? "Row order is checked." : "Rows may be in any order."} Column names are not checked, but their order is.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {hints.button}
          <SolutionToggle open={showSolution} onToggle={() => setShowSolution((s) => !s)} />
        </div>
        {hints.list}
        {showSolution && (
          <div className="mt-4 animate-fade-up">
            <CodeBlock code={challenge.solution} lang="sql" />
            <p className="mt-2 text-sm leading-relaxed text-muted">{challenge.explanation}</p>
          </div>
        )}
      </section>

      {/* Centre: editor */}
      <section aria-labelledby="editor-h" className={cn(panel, "p-5")}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="editor-h" className="font-semibold">
            SQL editor
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted" role="status">
            {engine === "loading" && (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Loading database engine…
              </>
            )}
            {engine === "ready" && (
              <>
                <span className="size-2 rounded-full bg-success" aria-hidden="true" /> DuckDB ready
              </>
            )}
            {engine === "failed" && <span className="text-danger">Engine failed to load. Reload the page.</span>}
          </span>
        </div>
        <SqlEditor value={code} onChange={setCode} onRun={run} schema={schema} />
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
              setResult(null);
              setError(null);
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
            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy SQL"}
          </Button>
          <span className="ml-auto hidden text-xs text-muted sm:block">Ctrl or ⌘ + Enter to run</span>
        </div>
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted">Try a sample query on {active.name}</p>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueriesFor(active).map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setCode(s.sql)}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Runs in your browser on DuckDB, a real SQL engine with PostgreSQL-style syntax. Read-only, one statement at a time, stopped after {TIME_LIMIT_MS / 1000} seconds, first {ROW_LIMIT.toLocaleString("en-US")} rows shown.
        </p>
      </section>

      {/* Right: dataset */}
      <section aria-labelledby="data-h" className={cn(panel, "min-w-0 p-5")}>
        <div className="flex items-center justify-between gap-2">
          <h2 id="data-h" className="font-semibold">
            Database explorer
          </h2>
          <Link href={database === "hr" ? "/datasets/employee-information" : "/datasets/retail-sales"} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            Details and download
          </Link>
        </div>
        <div role="tablist" aria-label="Tables" className="mt-3 flex flex-wrap gap-1.5">
          {tables.map((t, i) => (
            <button
              key={t.name}
              role="tab"
              type="button"
              aria-selected={table === i}
              onClick={() => setTable(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                table === i ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted hover:text-foreground",
              )}
            >
              <Table2 className="size-3" /> {t.name}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1 rounded-lg border border-dashed border-border p-2.5">
          {active.columns.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted">
              {c}
              <span className="text-[10px] text-muted/70">{inferColumnTypes(active.columns, active.preview)[c]}</span>
            </span>
          ))}
        </div>
        <p className="mb-2 mt-3 text-xs text-muted">
          {active.rows.toLocaleString("en-US")} rows. First {active.preview.length} shown.
        </p>
        <DataTable label={`${active.name} preview`} columns={active.columns} rows={active.preview.map((r) => active.columns.map((c) => r[c] ?? null))} />
        {DATABASES[database].relationships.length > 0 && (
          <div className="mt-3 rounded-lg border border-dashed border-border p-2.5">
            <p className="mb-1 text-xs font-medium text-muted">Relationships (foreign keys)</p>
            <ul className="space-y-0.5 font-mono text-[11px] text-muted">
              {DATABASES[database].relationships.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Bottom: output */}
      <section aria-labelledby="output-h" className={cn(panel, "p-5 lg:col-span-3")}>
        <h2 id="output-h" className="font-semibold">
          Query output
        </h2>
        <div aria-live="polite" className="mt-3 space-y-3">
          {check && (
            <div className={cn("rounded-lg border p-4", check.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10")}>
              <p className="flex items-start gap-2 font-medium">
                {check.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
                {check.pass ? "Correct. Your query passed both test cases." : "Not yet."}
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
                      <Link href={`/practice/sql/${next.slug}`}>
                        Next: {next.title} <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
              <p className="flex items-start gap-2 font-medium">
                <XCircle className="mt-0.5 size-4 shrink-0 text-danger" /> The query did not run
              </p>
              <pre className="mt-2 whitespace-pre-wrap pl-6 font-mono text-[12.5px] leading-relaxed">{error.message}</pre>
              {error.hint && <p className="mt-2 pl-6 text-sm leading-relaxed text-muted">{error.hint}</p>}
            </div>
          )}
          {result ? (
            <>
              <p className="text-xs text-muted">
                {result.rows.length.toLocaleString("en-US")} row{result.rows.length === 1 ? "" : "s"}
                {result.truncated ? ` (first ${ROW_LIMIT.toLocaleString("en-US")} shown)` : ""} · {result.ms} ms
              </p>
              {result.rows.length > 0 ? (
                <DataTable label="Query result" columns={result.columns} rows={result.rows} />
              ) : (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">The query ran and returned no rows.</p>
              )}
            </>
          ) : (
            !error && <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">Run your query to see its result here, or Submit to check it against the test cases.</p>
          )}
        </div>
      </section>
    </div>
  );
}
