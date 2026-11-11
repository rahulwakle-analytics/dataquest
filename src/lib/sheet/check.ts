import { cellsIn, formatValue, isErr, parseAddr, Sheet, shiftFormula, syntaxProblem, type Raw, type Scalar, type SheetSpec } from "./engine";

export type FormulaTest = {
  /** Completes the sentence "…fails when ___". */
  name: string;
  /** Cell values to change on the base sheet, keyed by address. */
  patch?: Record<string, Raw>;
  /** Or a whole replacement sheet, e.g. a table with more rows. */
  sheet?: SheetSpec;
  fill?: string;
};

export type FormulaTask = {
  sheet: SheetSpec;
  /** The cell the learner writes the formula in. */
  target: string;
  /** Range the formula is copied into (includes the target). Omit for a single cell. */
  fill?: string;
  /** Reference formula. Expected values for every test are calculated from it. */
  solution: string;
  /** Hand-checked values for the sample sheet, in fill order. Used by the content verification script. */
  expect: (number | string)[];
  tests: FormulaTest[];
  /** Formulas that must be rejected. Used by the content verification script. */
  wrong: string[];
};

export function patchSheet(spec: SheetSpec, patch: Record<string, Raw> = {}): SheetSpec {
  const rows = spec.rows.map((r) => [...r]);
  for (const [addr, v] of Object.entries(patch)) {
    const { c, r } = parseAddr(addr);
    while (rows.length <= r) rows.push([]);
    rows[r][c] = v;
  }
  return { ...spec, rows };
}

/** The formula written in `target`, copied to every cell of `fill`. */
export function fillFormulas(formula: string, target: string, fill?: string): Map<string, string> {
  const t = parseAddr(target);
  const out = new Map<string, string>();
  for (const cell of cellsIn(fill ?? target)) out.set(cell.addr, shiftFormula(formula, cell.r - t.r, cell.c - t.c));
  return out;
}

export function evaluateFill(spec: SheetSpec, formula: string, target: string, fill?: string) {
  const formulas = fillFormulas(formula, target, fill);
  const sheet = new Sheet(spec, formulas);
  const cells = cellsIn(fill ?? target).map((cell) => ({ ...cell, formula: formulas.get(cell.addr)!, value: sheet.value(cell.c, cell.r) }));
  return { sheet, cells };
}

export function sameValue(a: Scalar, b: Scalar, tolerance = 1e-9): boolean {
  if (isErr(a) || isErr(b)) return false;
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b));
  return a === b;
}

export type TestOutcome = { name: string; pass: boolean };
export type CheckResult = { pass: boolean; tests: TestOutcome[]; feedback: string };

export function checkFormula(task: FormulaTask, input: string): CheckResult {
  const formula = input.trim();
  const problem = syntaxProblem(formula);
  if (problem) return { pass: false, tests: [], feedback: problem };

  const cases = [
    { name: "the sample data", spec: task.sheet, fill: task.fill },
    ...task.tests.map((t) => ({ name: t.name, spec: t.sheet ?? patchSheet(task.sheet, t.patch), fill: t.fill ?? task.fill })),
  ];

  const tests: TestOutcome[] = [];
  let feedback = "";
  cases.forEach((tc, i) => {
    const got = evaluateFill(tc.spec, formula, task.target, tc.fill).cells;
    const want = evaluateFill(tc.spec, task.solution, task.target, tc.fill).cells;
    const badIndex = got.findIndex((g, j) => !sameValue(g.value, want[j].value));
    tests.push({ name: tc.name, pass: badIndex < 0 });
    if (badIndex < 0 || feedback) return;

    const bad = got[badIndex];
    const fmt = tc.spec.formats?.[bad.addr.replace(/\d+/g, "")];
    const shown = formatValue(bad.value, fmt) || "an empty result";
    const expected = formatValue(want[badIndex].value, fmt);
    if (i > 0) {
      feedback = `Your formula gives the right numbers for the sample data, but it fails when ${tc.name}. Check whether a value is typed into the formula instead of being read from a cell, or whether a range is fixed to the rows you can see.`;
    } else if (badIndex === 0) {
      feedback = `${bad.addr} shows ${shown}, but it should be ${expected}.`;
    } else {
      feedback = `${task.target} is right, but the copy in ${bad.addr} became ${bad.formula} and shows ${shown} instead of ${expected}. Look at which part of each reference moved and decide what needs a $ to stay put.`;
    }
  });

  const pass = tests.every((t) => t.pass);
  return { pass, tests, feedback: pass ? "" : feedback };
}
