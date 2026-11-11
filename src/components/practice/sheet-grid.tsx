"use client";

import { useMemo } from "react";
import { evaluateFill } from "@/lib/sheet/check";
import { cellsIn, formatValue, indexToCol, isErr, parseRange, Sheet, type SheetSpec } from "@/lib/sheet/engine";
import { cn } from "@/lib/utils";

type Props = {
  spec: SheetSpec;
  /** A formula that parses, or null to leave the answer cells empty. */
  formula: string | null;
  target: string;
  fill?: string;
  showFormulas: boolean;
  caption: string;
};

export function SheetGrid({ spec, formula, target, fill, showFormulas, caption }: Props) {
  const { sheet, filled } = useMemo(() => {
    if (!formula) return { sheet: new Sheet(spec), filled: new Map<string, string>() };
    const res = evaluateFill(spec, formula, target, fill);
    return { sheet: res.sheet, filled: new Map(res.cells.map((c) => [c.addr, c.formula])) };
  }, [spec, formula, target, fill]);

  const answer = new Set(cellsIn(fill ?? target).map((c) => c.addr));
  const tables = (spec.tables ?? []).map((t) => parseRange(t.ref));
  const inTable = (c: number, r: number) => tables.some((t) => c >= t.c0 && c <= t.c1 && r >= t.r0 && r <= t.r1);
  const isTableHeader = (c: number, r: number) => tables.some((t) => c >= t.c0 && c <= t.c1 && r === t.r0);
  const cols = Array.from({ length: sheet.colCount }, (_, i) => i);

  return (
    <div tabIndex={0} role="region" aria-label={caption} className="overflow-x-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <table className="w-full border-collapse font-mono text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-surface text-muted">
            <th className="w-9 border-b border-r border-border px-2 py-1 font-normal" />
            {cols.map((c) => (
              <th key={c} scope="col" className="min-w-[84px] border-b border-r border-border px-2 py-1 font-normal last:border-r-0">
                {indexToCol(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((_, r) => (
            <tr key={r}>
              <th scope="row" className="border-b border-r border-border bg-surface px-2 py-1 text-center font-normal text-muted">
                {r + 1}
              </th>
              {cols.map((c) => {
                const addr = `${indexToCol(c)}${r + 1}`;
                const v = sheet.value(c, r);
                const isAnswer = answer.has(addr);
                const f = filled.get(addr);
                const display = showFormulas && f ? f : formatValue(v, spec.formats?.[indexToCol(c)]);
                const numeric = typeof v === "number" && !(showFormulas && f);
                return (
                  <td
                    key={c}
                    className={cn(
                      "whitespace-nowrap border-b border-r border-border px-2 py-1.5 last:border-r-0",
                      numeric ? "text-right tabular-nums" : "text-left",
                      inTable(c, r) && "bg-primary/[0.04]",
                      (r === 0 || isTableHeader(c, r)) && typeof v === "string" && "font-semibold",
                      isAnswer && "bg-primary/10 outline outline-1 -outline-offset-1 outline-primary/50",
                      addr === target && "outline-2 outline-primary",
                      isErr(v) && "text-danger",
                    )}
                  >
                    {display || (isAnswer ? <span className="text-muted/50">{addr === target ? "?" : ""}</span> : "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FormulaBar({
  id,
  cell,
  value,
  onChange,
  onEnter,
  problem,
}: {
  id: string;
  cell: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  problem: string | null;
}) {
  return (
    <div>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-surface focus-within:ring-2 focus-within:ring-primary">
        <label htmlFor={id} className="flex items-center border-r border-border px-3 font-mono text-[13px] font-semibold">
          <span className="sr-only">Formula for cell </span>
          {cell}
        </label>
        <span aria-hidden="true" className="flex items-center px-2.5 font-serif text-sm italic text-muted">
          fx
        </span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) onEnter();
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder="Type a formula, starting with ="
          aria-invalid={Boolean(problem)}
          aria-describedby={`${id}-msg`}
          className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 font-mono text-[13px] placeholder:text-muted/70 focus:outline-none"
        />
      </div>
      <p id={`${id}-msg`} className="mt-1.5 min-h-5 text-xs text-muted" aria-live="polite">
        {problem}
      </p>
    </div>
  );
}
