/**
 * Content verification. Run with `npm run verify`.
 * For every interactive exercise it checks that:
 *  - the reference solution produces the hand-written expected values,
 *  - the reference solution passes its own test cases,
 *  - every listed wrong answer is rejected,
 * and it runs a set of formula-engine unit tests.
 */
import { lessons } from "../src/content";
import { powerbiExercises } from "../src/content/powerbi-practice";
import { sheetChallenges, sortFilterChallenges } from "../src/content/sheet-challenges";
import { sqlChallenges } from "../src/content/sql-challenges";
import { checkFormula, evaluateFill, fillFormulas } from "../src/lib/sheet/check";
import { isErr, Sheet, shiftFormula, type Raw } from "../src/lib/sheet/engine";
import { checkTargets } from "../src/lib/sheet/playground-check";
import { DATABASES, TABLES_OF } from "../src/lib/sql/databases";
import { applyView, checkView } from "../src/lib/table-practice";

let failures = 0;
let checks = 0;
function ok(cond: boolean, label: string) {
  checks++;
  if (!cond) {
    failures++;
    console.error("FAIL  " + label);
  }
}
const near = (a: unknown, b: number | string) => (typeof b === "number" ? typeof a === "number" && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)) : a === b);

/* ---- engine unit tests ---- */
const grid: Raw[][] = [
  ["Item", "Qty", "Price", "Note"],
  ["A", 2, 10, "x"],
  ["B", 3, 20, null],
  ["C", 5, 0.5, "pending"],
  ["D", null, 4, ""],
];
const calc = (f: string) => {
  const v = new Sheet({ rows: grid, tables: [{ name: "T", ref: "A1:D5" }] }, new Map([["F2", f]])).value(5, 1);
  return isErr(v) ? v.error : v;
};
const unit: [string, number | string | boolean][] = [
  ["=1+2*3", 7],
  ["=(1+2)*3", 9],
  ["=-2^2", 4],
  ["=2^3^2", 64],
  ["=10%", 0.1],
  ["=B2*C2", 20],
  ["=SUM(B2:B5)", 10],
  ["=AVERAGE(B2:B5)", 10 / 3],
  ["=COUNT(B2:B5)", 3],
  ["=COUNTA(D2:D5)", 2],
  ["=COUNTBLANK(B2:B5)", 1],
  ["=MAX(C2:C5)-MIN(C2:C5)", 19.5],
  ["=ROUND(2.345,2)", 2.35],
  ["=ROUND(-2.5,0)", -3],
  ["=ROUND(1234.5678,-2)", 1200],
  ["=ROUNDDOWN(2.99,0)", 2],
  ["=IF(B2>1,\"big\",\"small\")", "big"],
  ["=IF(B5=0,1,2)", 1],
  ["=AND(B2>1,C2>1)", true],
  ["=OR(B2>5,C2>50)", false],
  ["=1/0", "#DIV/0!"],
  ["=IFERROR(1/0,99)", 99],
  ["=NOPE(1)", "#NAME?"],
  ["=A2+1", "#VALUE!"],
  ["=A2&\"-\"&B2", "A-2"],
  ["=SUMIF(B2:B5,\">2\",C2:C5)", 20.5],
  ["=COUNTIF(A2:A5,\"b\")", 1],
  ["=COUNTIF(D2:D5,\"p*\")", 1],
  ["=AVERAGEIF(B2:B5,\">=3\")", 4],
  ["=SUM(T[Qty])", 10],
  ["=[@Qty]*[@Price]", 20],
  ["=SUMIF(T[Item],\"C\",T[Price])", 0.5],
  ["=SUM(B2:B5)/COUNT(B2:B5)", 10 / 3],
  ["=SUMIFS(C2:C5,B2:B5,\">2\")", 20.5],
  ["=COUNTIFS(B2:B5,\">2\",A2:A5,\"<>A\")", 2],
  ["=AVERAGEIFS(C2:C5,B2:B5,\">=3\")", 10.25],
  ["=XLOOKUP(\"C\",A2:A5,C2:C5)", 0.5],
  ["=XLOOKUP(\"Z\",A2:A5,C2:C5,\"missing\")", "missing"],
  ["=XLOOKUP(\"Z\",A2:A5,C2:C5)", "#N/A"],
  ["=UPPER(LEFT(A3,1))&LEN(\"abc\")", "B3"],
  ["=F2", "#CYCLE!"],
  ["=1<2", true],
  ["=\"a\"=\"A\"", true],
];
for (const [f, want] of unit) {
  const got = calc(f);
  ok(typeof want === "number" ? near(got, want) : got === want, `engine ${f} → expected ${want}, got ${String(got)}`);
}
const shifts: [string, number, number, string][] = [
  ["=B2*C2", 1, 0, "=B3*C3"],
  ["=B2*$F$1", 3, 2, "=D5*$F$1"],
  ["=$A2*B$1", 2, 3, "=$A4*E$1"],
  ["=SUM($B$2:B2)", 2, 0, "=SUM($B$2:B4)"],
  ["=A1", -1, 0, "=#REF!"],
  ["=[@Qty]*B2", 1, 1, "=[@Qty]*C3"],
  ['=IF(A1="A1",B1,0)', 1, 0, '=IF(A2="A1",B2,0)'],
];
for (const [f, dr, dc, want] of shifts) ok(shiftFormula(f, dr, dc) === want, `shift ${f} by (${dr},${dc}) → expected ${want}, got ${shiftFormula(f, dr, dc)}`);
ok(fillFormulas("=B2*F$1", "C2", "C2:D3").get("D3") === "=C3*G$1", "fillFormulas across and down");

/* ---- exercises ---- */
let formulaCount = 0;
let tableCount = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  lesson.practice.forEach((q, i) => {
    const where = `${id} #${i + 1} “${q.title}”`;
    if (q.kind === "formula") {
      formulaCount++;
      const cells = evaluateFill(q.sheet, q.solution, q.target, q.fill).cells;
      ok(cells.length === q.expect.length, `${where}: expect has ${q.expect.length} values for ${cells.length} cells`);
      cells.forEach((c, j) => ok(near(c.value, q.expect[j]), `${where}: ${c.addr} solution gives ${JSON.stringify(c.value)}, hand-checked value is ${q.expect[j]}`));
      ok(checkFormula(q, q.solution).pass, `${where}: reference solution fails its own tests`);
      ok(q.tests.length >= 1, `${where}: needs at least one test beyond the sample data`);
      for (const w of q.wrong) ok(!checkFormula(q, w).pass, `${where}: wrong answer ${w} was accepted`);
      ok(!checkFormula(q, q.solution.slice(1)).pass, `${where}: accepted input without =`);
      ok((q.hints?.length ?? 0) >= 3, `${where}: needs three progressive hints`);
    } else if (q.kind === "table") {
      tableCount++;
      const ids = applyView(q.dataset, q.goal).map((r) => r[q.dataset.idKey]);
      ok(JSON.stringify(ids) === JSON.stringify(q.expectIds), `${where}: goal view gives ${ids.join(",")}, hand-checked order is ${q.expectIds.join(",")}`);
      ok(checkView(q.dataset, q.goal, q.goal).pass, `${where}: goal view fails its own check`);
      ok(!checkView(q.dataset, q.goal, { filters: [], sort: [{ col: q.dataset.idKey, dir: "asc" }] }).pass || (q.goal.filters.length === 0 && q.goal.sort.length === 0), `${where}: the untouched table was accepted`);
      if (q.goal.sort.length) ok(!checkView(q.dataset, q.goal, { ...q.goal, sort: q.goal.sort.map((s) => ({ ...s, dir: s.dir === "asc" ? "desc" : "asc" })) }).pass, `${where}: reversed sort was accepted`);
      if (q.goal.filters.length) ok(!checkView(q.dataset, q.goal, { ...q.goal, filters: [] }).pass, `${where}: unfiltered view was accepted`);
    }
    ok(q.kind === "table" ? q.steps.length > 0 : Boolean(q.solution), `${where}: missing solution`);
  });
  lesson.checks.forEach((c, i) => ok(c.answer >= 0 && c.answer < c.options.length && new Set(c.options).size === c.options.length, `${id} check ${i + 1}: bad answer index or duplicate options`));
  ok(lesson.checks.length >= 2, `${id}: needs two knowledge checks`);
}

/* ---- Excel Fundamentals completeness ---- */
for (const slug of ["formulas-and-cell-references", "sorting-and-filtering", "core-functions", "tables-and-formatting"]) {
  const l = lessons[`excel/${slug}`];
  ok(Boolean(l), `excel/${slug}: lesson missing`);
  if (!l) continue;
  ok(l.practice.length >= 5, `excel/${slug}: has ${l.practice.length} practice questions, needs 5`);
  for (const d of ["Easy", "Medium", "Hard"]) ok(l.practice.some((q) => q.difficulty === d), `excel/${slug}: no ${d} question`);
  const order = l.practice.filter((q) => q.kind).map((q) => ["Easy", "Medium", "Hard"].indexOf(q.difficulty));
  ok(order.every((d, i) => i === 0 || d >= order[i - 1]), `excel/${slug}: interactive questions are not in difficulty order`);
  ok(new Set(l.practice.map((q) => q.title)).size === l.practice.length, `excel/${slug}: duplicate question titles`);
}

/* ---- Excel Playground challenges ---- */
for (const c of sheetChallenges) {
  const where = `practice-excel/${c.slug} "${c.title}"`;
  const solved = checkTargets(c.sheet, c.targets, new Map(Object.entries(c.solution)), c.solution);
  ok(solved.pass, `${where}: reference solution fails its own check`);
  ok(c.targets.every((t) => t in c.solution), `${where}: not every target has a reference formula`);
  ok((c.hints?.length ?? 0) >= 2, `${where}: needs at least two hints`);
  // An empty answer must never pass.
  ok(!checkTargets(c.sheet, c.targets, new Map(), c.solution).pass, `${where}: empty answer was accepted`);
}
ok(new Set(sheetChallenges.map((c) => c.slug)).size === sheetChallenges.length, "sheetChallenges: duplicate slugs");

for (const { slug, question: q } of sortFilterChallenges) {
  const where = `practice-excel/${slug} "${q.title}"`;
  const ids = applyView(q.dataset, q.goal).map((r) => r[q.dataset.idKey]);
  ok(JSON.stringify(ids) === JSON.stringify(q.expectIds), `${where}: goal view gives ${ids.join(",")}, hand-checked order is ${q.expectIds.join(",")}`);
  ok(checkView(q.dataset, q.goal, q.goal).pass, `${where}: goal view fails its own check`);
}

/* ---- Power BI Practice Lab ---- */
for (const e of powerbiExercises) {
  const where = `practice-powerbi/${e.slug} "${e.title}"`;
  ok(e.answer >= 0 && e.answer < e.options.length, `${where}: answer index out of range`);
  ok(new Set(e.options).size === e.options.length, `${where}: duplicate options`);
  ok(e.options.length >= 3, `${where}: needs at least 3 options`);
}
ok(new Set(powerbiExercises.map((e) => e.slug)).size === powerbiExercises.length, "powerbiExercises: duplicate slugs");

/* ---- SQL Playground challenges ----
 * DuckDB-WASM only runs in a browser, so actual query execution is verified by the Playwright
 * suite, not here. This checks the structural shape every challenge must have. */
for (const c of sqlChallenges) {
  const where = `practice-sql/${c.slug} "${c.title}"`;
  const db = c.database ?? "retail";
  ok(db in DATABASES, `${where}: unknown database "${db}"`);
  ok(c.columns.length > 0, `${where}: needs at least one expected column`);
  ok(c.topics.length > 0, `${where}: needs at least one topic`);
  ok(c.hints.length >= 2, `${where}: needs at least two hints`);
  ok(c.wrong.length >= 1, `${where}: needs at least one rejected ("wrong") query`);
  ok(/^\s*(select|with)\b/i.test(c.solution), `${where}: reference solution must start with SELECT or WITH`);
  ok(c.wrong.every((w) => w.trim() !== c.solution.trim()), `${where}: a "wrong" query is identical to the solution`);
  const tables = TABLES_OF(db as keyof typeof DATABASES);
  ok(tables.some((t) => c.solution.includes(t)), `${where}: reference solution does not mention any table in the "${db}" database`);
}
ok(new Set(sqlChallenges.map((c) => c.slug)).size === sqlChallenges.length, "sqlChallenges: duplicate slugs");

console.log(
  `${checks - failures}/${checks} checks passed (${unit.length} engine cases, ${shifts.length} copy cases, ${formulaCount} formula exercises, ${tableCount} table exercises, ` +
    `${Object.keys(lessons).length} lessons, ${sheetChallenges.length} Excel Playground challenges, ${sortFilterChallenges.length} sort/filter challenges, ${powerbiExercises.length} Power BI exercises, ` +
    `${sqlChallenges.length} SQL challenges across ${Object.keys(DATABASES).length} databases)`,
);
process.exit(failures ? 1 : 0);
