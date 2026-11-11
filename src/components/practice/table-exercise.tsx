"use client";

import { CheckCircle2, Plus, RotateCcw, X, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TableQuestion } from "@/content/types";
import { isSolved, recordExercise, useProgress } from "@/lib/progress";
import { applyView, checkView, NUMBER_OPS, TEXT_OPS, type Cell, type Column, type Filter, type FilterOp, type SortLevel, type TableCheck } from "@/lib/table-practice";
import { hintsOf, SolutionToggle, useHints } from "./hints";

type Props = { topicId: string; index: number; question: TableQuestion };
type DraftFilter = { col: string; op: FilterOp; value: string };

const selectCls =
  "h-9 min-w-0 rounded-md border border-border bg-surface px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const dirLabels = (type: Column["type"]) =>
  type === "text"
    ? { asc: "A → Z", desc: "Z → A" }
    : type === "date"
      ? { asc: "Oldest → newest", desc: "Newest → oldest" }
      : { asc: "Smallest → largest", desc: "Largest → smallest" };

const opLabel: Record<FilterOp, string> = { is: "is", "is not": "is not", ">": ">", ">=": "≥", "<": "<", "<=": "≤" };

function show(v: Cell, col: Column) {
  if (col.fmt === "money" && typeof v === "number") return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return String(v);
}

export function TableExercise({ topicId, index, question: q }: Props) {
  const progress = useProgress();
  const solved = isSolved(progress, topicId, index);
  const data = q.dataset;
  const colOf = (key: string) => data.columns.find((c) => c.key === key)!;
  const firstCol = data.columns[1] ?? data.columns[0];

  const [sort, setSort] = useState<SortLevel[]>([]);
  const [filters, setFilters] = useState<DraftFilter[]>([]);
  const [result, setResult] = useState<TableCheck | null>(null);
  const [solution, setSolution] = useState(false);
  const hints = useHints(hintsOf(q));

  const view = useMemo(() => {
    const fs: Filter[] = filters
      .filter((f) => f.value !== "")
      .map((f) => ({ col: f.col, op: f.op, value: colOf(f.col).type === "number" ? Number(f.value) : f.value }));
    return { filters: fs, sort };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);
  const rows = useMemo(() => applyView(data, view), [data, view]);

  const touch = () => setResult(null);
  const setSortAt = (i: number, patch: Partial<SortLevel>) => {
    setSort((s) => s.map((l, j) => (j === i ? { ...l, ...patch } : l)));
    touch();
  };
  const setFilterAt = (i: number, patch: Partial<DraftFilter>) => {
    setFilters((fs) =>
      fs.map((f, j) => {
        if (j !== i) return f;
        const next = { ...f, ...patch };
        if (patch.col && patch.col !== f.col) {
          next.op = colOf(patch.col).type === "text" ? "is" : ">=";
          next.value = "";
        }
        return next;
      }),
    );
    touch();
  };
  const distinct = (key: string) => [...new Set(data.rows.map((r) => String(r[key])))].sort();

  const check = () => {
    const res = checkView(data, q.goal, view);
    setResult(res);
    if (res.pass) recordExercise(topicId, index);
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{q.title}</h3>
        <div className="flex items-center gap-2">
          {solved && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Solved
            </Badge>
          )}
          <Badge variant={difficultyVariant(q.difficulty)}>{q.difficulty}</Badge>
        </div>
      </div>
      <p className="mt-2 leading-relaxed text-muted">{q.prompt}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <fieldset className="min-w-0 rounded-lg border border-border bg-surface/60 p-3">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Sort</legend>
          <div className="space-y-2">
            {sort.length === 0 && <p className="text-sm text-muted">No sort applied.</p>}
            {sort.map((l, i) => (
              <div key={i} className="flex min-w-0 items-center gap-2 [&_select]:min-w-0 [&_input]:min-w-0">
                <span className="w-14 shrink-0 text-xs text-muted">{i === 0 ? "Sort by" : "Then by"}</span>
                <select aria-label={`Sort level ${i + 1} column`} className={`${selectCls} flex-1`} value={l.col} onChange={(e) => setSortAt(i, { col: e.target.value })}>
                  {data.columns.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select aria-label={`Sort level ${i + 1} direction`} className={`${selectCls} flex-1`} value={l.dir} onChange={(e) => setSortAt(i, { dir: e.target.value as "asc" | "desc" })}>
                  <option value="asc">{dirLabels(colOf(l.col).type).asc}</option>
                  <option value="desc">{dirLabels(colOf(l.col).type).desc}</option>
                </select>
                <Button variant="ghost" size="icon" className="size-9 shrink-0" aria-label={`Remove sort level ${i + 1}`} onClick={() => (setSort((s) => s.filter((_, j) => j !== i)), touch())}>
                  <X />
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => (setSort((s) => [...s, { col: firstCol.key, dir: "asc" }]), touch())}>
              <Plus /> Add sort level
            </Button>
          </div>
        </fieldset>

        <fieldset className="min-w-0 rounded-lg border border-border bg-surface/60 p-3">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Filter</legend>
          <div className="space-y-2">
            {filters.length === 0 && <p className="text-sm text-muted">No filters applied.</p>}
            {filters.map((f, i) => {
              const col = colOf(f.col);
              return (
                <div key={i} className="flex min-w-0 items-center gap-2 [&_select]:min-w-0 [&_input]:min-w-0">
                  <select aria-label={`Filter ${i + 1} column`} className={`${selectCls} flex-1`} value={f.col} onChange={(e) => setFilterAt(i, { col: e.target.value })}>
                    {data.columns.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <select aria-label={`Filter ${i + 1} condition`} className={`${selectCls} w-[76px] shrink-0`} value={f.op} onChange={(e) => setFilterAt(i, { op: e.target.value as FilterOp })}>
                    {(col.type === "text" ? TEXT_OPS : NUMBER_OPS).map((op) => (
                      <option key={op} value={op}>
                        {opLabel[op]}
                      </option>
                    ))}
                  </select>
                  {col.type === "text" ? (
                    <select aria-label={`Filter ${i + 1} value`} className={`${selectCls} flex-1`} value={f.value} onChange={(e) => setFilterAt(i, { value: e.target.value })}>
                      <option value="">Choose…</option>
                      {distinct(f.col).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      aria-label={`Filter ${i + 1} value`}
                      type={col.type === "date" ? "date" : "number"}
                      className={`${selectCls} w-0 flex-1`}
                      value={f.value}
                      onChange={(e) => setFilterAt(i, { value: e.target.value })}
                    />
                  )}
                  <Button variant="ghost" size="icon" className="size-9 shrink-0" aria-label={`Remove filter ${i + 1}`} onClick={() => (setFilters((fs) => fs.filter((_, j) => j !== i)), touch())}>
                    <X />
                  </Button>
                </div>
              );
            })}
            <Button variant="secondary" size="sm" onClick={() => (setFilters((fs) => [...fs, { col: firstCol.key === "date" ? data.columns[2].key : firstCol.key, op: "is", value: "" }]), touch())}>
              <Plus /> Add filter
            </Button>
            {filters.length > 1 && <p className="text-xs text-muted">Two “is” filters on the same column keep rows matching either value, like ticking two boxes.</p>}
          </div>
        </fieldset>
      </div>

      <p className="mt-4 text-xs text-muted" aria-live="polite">
        Showing {rows.length} of {data.rows.length} rows
      </p>
      <div tabIndex={0} role="region" aria-label={`${q.title}: table`} className="mt-1.5 max-h-[340px] overflow-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <table className="w-full border-collapse text-left font-mono text-[13px]">
          <caption className="sr-only">{q.title}: current view</caption>
          <thead className="sticky top-0 bg-surface text-muted">
            <tr>
              {data.columns.map((c) => (
                <th key={c.key} scope="col" className={`whitespace-nowrap border-b border-border px-3 py-2 font-medium ${c.type === "number" ? "text-right" : ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[data.idKey])} className="border-b border-border last:border-b-0">
                {data.columns.map((c) => (
                  <td key={c.key} className={`whitespace-nowrap px-3 py-1.5 ${c.type === "number" ? "text-right tabular-nums" : ""}`}>
                    {show(r[c.key], c)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={data.columns.length} className="px-3 py-6 text-center font-sans text-muted">
                  No rows match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={check}>
          Check answer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSort([]);
            setFilters([]);
            touch();
          }}
        >
          <RotateCcw /> Reset
        </Button>
        {hints.button}
        <SolutionToggle open={solution} onToggle={() => setSolution((s) => !s)} />
      </div>

      <div aria-live="polite">
        {result && (
          <div className={`mt-4 animate-fade-up rounded-lg border p-4 text-sm ${result.pass ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10"}`}>
            <p className="flex items-start gap-2 font-medium">
              {result.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
              {result.pass ? "Correct. The table shows the right rows in the right order." : "Not yet."}
            </p>
            {!result.pass && <p className="mt-2 pl-6">{result.feedback}</p>}
            {result.pass && q.explanation && <p className="mt-2 pl-6 text-muted">{q.explanation}</p>}
          </div>
        )}
      </div>

      {hints.list}
      {solution && (
        <div className="mt-4 animate-fade-up rounded-lg border border-border bg-surface p-4 text-sm">
          <ol className="list-decimal space-y-1 pl-5">
            {q.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {q.explanation && <p className="mt-3 text-muted">{q.explanation}</p>}
        </div>
      )}
    </article>
  );
}
