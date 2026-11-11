"use client";

import { useMemo, useState } from "react";
import { formatValue, indexToCol, isErr, parseAddr, Sheet, syntaxProblem, type SheetSpec } from "@/lib/sheet/engine";
import { cn } from "@/lib/utils";
import { FormulaBar } from "./sheet-grid";

type Props = {
  spec: SheetSpec;
  targets: string[];
  overrides: Map<string, string>;
  onChange: (addr: string, value: string) => void;
  caption: string;
};

/** A full editable grid: click any target cell to select it, then type its value or formula in the formula bar. */
export function EditableGrid({ spec, targets, overrides, onChange, caption }: Props) {
  const targetSet = useMemo(() => new Set(targets), [targets]);
  const sheet = useMemo(() => new Sheet(spec, overrides), [spec, overrides]);
  const [selected, setSelected] = useState(targets[0] ?? "A1");
  const cols = Array.from({ length: sheet.colCount }, (_, i) => i);

  const selAddr = parseAddr(selected);
  const selRaw = overrides.get(selected);
  const selValue = selRaw !== undefined ? selRaw : String(sheet.raw(selAddr.c, selAddr.r) ?? "");
  const selIsTarget = targetSet.has(selected);
  const problem = selIsTarget && selValue.trim().startsWith("=") ? syntaxProblem(selValue) : null;

  return (
    <div className="space-y-2">
      <FormulaBar id="playground-fx" cell={selected} value={selIsTarget ? selValue : selValue} onChange={(v) => selIsTarget && onChange(selected, v)} problem={problem} />
      {!selIsTarget && <p className="-mt-1 text-xs text-muted">This cell is sample data and can&apos;t be edited. Select a highlighted cell to answer.</p>}
      <div tabIndex={0} role="region" aria-label={caption} className="overflow-x-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <table className="w-full border-collapse font-mono text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-surface text-muted">
              <th className="w-9 border-b border-r border-border px-2 py-1 font-normal" />
              {cols.map((c) => (
                <th key={c} scope="col" className="min-w-[90px] border-b border-r border-border px-2 py-1 font-normal last:border-r-0">
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
                  const isTarget = targetSet.has(addr);
                  const v = sheet.value(c, r);
                  const display = formatValue(v, spec.formats?.[indexToCol(c)]);
                  const numeric = typeof v === "number";
                  return (
                    <td key={c} className="border-b border-r border-border p-0 last:border-r-0">
                      <button
                        type="button"
                        onClick={() => setSelected(addr)}
                        aria-label={`Cell ${addr}${isTarget ? ", answer cell" : ""}: ${display || "empty"}`}
                        className={cn(
                          "block w-full whitespace-nowrap px-2 py-1.5 text-left focus-visible:outline-none",
                          numeric ? "text-right tabular-nums" : "text-left",
                          r === 0 && typeof v === "string" && "font-semibold",
                          isTarget && "bg-primary/10",
                          isTarget && !overrides.has(addr) && "text-muted",
                          selected === addr && "outline outline-2 -outline-offset-1 outline-primary",
                          isErr(v) && "text-danger",
                        )}
                      >
                        {display || (isTarget ? "?" : "")}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
