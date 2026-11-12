"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { ChevronDown, Loader2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/practice/sql-workspace";
import { schemaFor, type DatabaseId } from "@/lib/sql/databases";
import { getEngine, runQuery, SqlError, type QueryResult } from "@/lib/sql/engine";

const SqlEditor = dynamic(() => import("@/components/practice/sql-editor"), {
  ssr: false,
  loading: () => <div className="flex h-[140px] items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted">Loading editor…</div>,
});

/**
 * An inline, ungraded "Try it yourself" runner attached to a worked SQL example. Edits run for
 * real against the actual practice database (DuckDB in the browser) — nothing here is
 * simulated or pre-baked. There is no submit/scoring step; it is purely for experimenting.
 */
export function SqlTryIt({ code, database = "retail" }: { code: string; database?: DatabaseId }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(code);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [engine, setEngine] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<SqlError | null>(null);
  const schema = schemaFor(database);

  const ensureEngine = useCallback(() => {
    if (engine !== "idle") return;
    setEngine("loading");
    getEngine(database).then(
      () => setEngine("ready"),
      () => setEngine("failed"),
    );
  }, [engine, database]);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      setResult(await runQuery(valueRef.current, database));
    } catch (e) {
      setResult(null);
      setError(e instanceof SqlError ? e : new SqlError(e instanceof Error ? e.message : String(e)));
    } finally {
      setRunning(false);
    }
  }, [running, database]);

  if (!open) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="mt-2"
        onClick={() => {
          setOpen(true);
          ensureEngine();
        }}
      >
        <Play /> Try it yourself
      </Button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted">Edit the query and run it for real</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted" role="status">
          {engine === "loading" && (
            <>
              <Loader2 className="size-3 animate-spin" /> Loading database engine…
            </>
          )}
          {engine === "ready" && (
            <>
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" /> Ready
            </>
          )}
          {engine === "failed" && <span className="text-danger">Engine failed to load.</span>}
        </span>
      </div>
      <SqlEditor value={value} onChange={setValue} onRun={() => void run()} schema={schema} height="140px" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => void run()} disabled={engine !== "ready" || running}>
          {running ? <Loader2 className="animate-spin" /> : <Play />} Run
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setValue(code);
            setResult(null);
            setError(null);
          }}
        >
          <RotateCcw /> Reset
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
        >
          <ChevronDown className="size-3.5" /> Hide
        </button>
      </div>
      {error && (
        <div className="mt-3 rounded-lg border border-danger/30 bg-danger/10 p-3">
          <p className="font-medium text-danger">The query did not run</p>
          <pre className="mt-1.5 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed">{error.message}</pre>
          {error.hint && <p className="mt-1.5 text-sm leading-relaxed text-muted">{error.hint}</p>}
        </div>
      )}
      {result && !error && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs text-muted">
            {result.rows.length.toLocaleString("en-US")} row{result.rows.length === 1 ? "" : "s"} · {result.ms} ms
          </p>
          {result.rows.length > 0 ? (
            <DataTable label="Query result" columns={result.columns} rows={result.rows} />
          ) : (
            <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted">The query ran and returned no rows.</p>
          )}
        </div>
      )}
    </div>
  );
}
