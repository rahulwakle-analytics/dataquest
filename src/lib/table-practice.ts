/** Sort and filter practice: the learner arranges a table, and the arrangement itself is checked. */

export type Cell = string | number;
export type Column = { key: string; label: string; type: "text" | "number" | "date"; fmt?: "money" };
export type Dataset = { columns: Column[]; idKey: string; rows: Record<string, Cell>[] };

export type FilterOp = "is" | "is not" | ">" | ">=" | "<" | "<=";
export type Filter = { col: string; op: FilterOp; value: Cell };
export type SortLevel = { col: string; dir: "asc" | "desc" };
export type View = { filters: Filter[]; sort: SortLevel[] };

export const TEXT_OPS: FilterOp[] = ["is", "is not"];
export const NUMBER_OPS: FilterOp[] = [">", ">=", "<", "<=", "is"];

function cmp(a: Cell, b: Cell) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "en", { sensitivity: "base" });
}

function test(row: Record<string, Cell>, f: Filter) {
  const d = cmp(row[f.col], f.value);
  switch (f.op) {
    case "is":
      return d === 0;
    case "is not":
      return d !== 0;
    case ">":
      return d > 0;
    case ">=":
      return d >= 0;
    case "<":
      return d < 0;
    default:
      return d <= 0;
  }
}

/**
 * Filters combine like Excel's filter menus: several "is" filters on one column match any of
 * the values (like ticking two boxes); everything else must all be true.
 */
export function applyView(data: Dataset, view: View) {
  const complete = view.filters.filter((f) => f.col && f.value !== "");
  const anyOf = new Map<string, Filter[]>();
  const rest: Filter[] = [];
  for (const f of complete) {
    if (f.op === "is") anyOf.set(f.col, [...(anyOf.get(f.col) ?? []), f]);
    else rest.push(f);
  }
  const rows = data.rows.filter((row) => rest.every((f) => test(row, f)) && [...anyOf.values()].every((fs) => fs.some((f) => test(row, f))));
  const levels = view.sort.filter((s) => s.col);
  // Array.prototype.sort is stable, so untouched ties keep their original order, as in Excel.
  return [...rows].sort((a, b) => {
    for (const s of levels) {
      const d = cmp(a[s.col], b[s.col]);
      if (d) return s.dir === "asc" ? d : -d;
    }
    return 0;
  });
}

export type TableCheck = { pass: boolean; feedback: string };

/** Compares what the learner's view shows with what the goal view shows. */
export function checkView(data: Dataset, goal: View, view: View): TableCheck {
  const want = applyView(data, goal);
  const got = applyView(data, view);
  const id = (r: Record<string, Cell>) => r[data.idKey];
  const wantIds = new Set(want.map(id));
  const gotIds = new Set(got.map(id));
  const extra = got.filter((r) => !wantIds.has(id(r)));
  const missing = want.filter((r) => !gotIds.has(id(r)));

  if (extra.length || missing.length) {
    const parts = [`Your table shows ${got.length} ${got.length === 1 ? "row" : "rows"}; the answer has ${want.length}.`];
    if (extra.length) parts.push(`Row ${id(extra[0])} should not be visible.`);
    else parts.push(`Row ${id(missing[0])} should be visible but is filtered out.`);
    return { pass: false, feedback: parts.join(" ") };
  }
  for (let i = 1; i < got.length; i++) {
    for (let k = 0; k < goal.sort.length; k++) {
      const s = goal.sort[k];
      const d = cmp(got[i - 1][s.col], got[i][s.col]);
      const ordered = s.dir === "asc" ? d <= 0 : d >= 0;
      if (!ordered) {
        const label = data.columns.find((c) => c.key === s.col)?.label ?? s.col;
        return {
          pass: false,
          feedback: `The right rows are showing, but rows ${id(got[i - 1])} and ${id(got[i])} are out of order by ${label}. ${goal.sort.length > 1 ? `Check sort level ${k + 1} and the order of your levels.` : "Check the column and direction you sorted by."}`,
        };
      }
      if (d !== 0) break;
    }
  }
  return { pass: true, feedback: "" };
}
