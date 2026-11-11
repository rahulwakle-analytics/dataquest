/**
 * Browser SQL engine. Queries run in DuckDB compiled to WebAssembly, inside a Web Worker in the
 * learner's own browser. Nothing is sent to a server and no application database is involved.
 *
 * Limits: one read-only statement per run, a time limit, and a cap on returned rows.
 */
export const TIME_LIMIT_MS = 8000;
export const ROW_LIMIT = 1000;
export const TABLES = ["customers", "products", "orders", "order_items"] as const;
export type Schema = "main" | "chk";

export type Cell = string | number | boolean | null;
export type QueryResult = { columns: string[]; rows: Cell[][]; truncated: boolean; ms: number };

export class SqlError extends Error {
  hint?: string;
  constructor(message: string, hint?: string) {
    super(message);
    this.hint = hint;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Engine = { db: any; conn: any };
let enginePromise: Promise<Engine> | null = null;

async function boot(): Promise<Engine> {
  const duckdb = await import("@duckdb/duckdb-wasm");
  const base = window.location.origin + "/duckdb/";
  const bundle = await duckdb.selectBundle({
    mvp: { mainModule: base + "duckdb-mvp.wasm", mainWorker: base + "duckdb-browser-mvp.worker.js" },
    eh: { mainModule: base + "duckdb-eh.wasm", mainWorker: base + "duckdb-browser-eh.worker.js" },
  });
  const worker = new Worker(bundle.mainWorker!);
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
  await db.instantiate(bundle.mainModule);
  await db.open({ query: { castBigIntToDouble: true, castDecimalToDouble: true } });
  const conn = await db.connect();
  await conn.query("CREATE SCHEMA chk");
  for (const schema of ["main", "chk"] as const) {
    for (const t of TABLES) {
      const res = await fetch(`/datasets/${schema === "chk" ? "check/" : ""}retail_${t}.csv`);
      if (!res.ok) throw new Error(`Could not load the ${t} table.`);
      const file = `${schema}_${t}.csv`;
      await db.registerFileText(file, await res.text());
      await conn.query(`CREATE TABLE ${schema}.${t} AS SELECT * FROM read_csv_auto('${file}', header = true)`);
    }
  }
  return { db, conn };
}

export function getEngine(): Promise<Engine> {
  if (!enginePromise) {
    enginePromise = boot().catch((e) => {
      enginePromise = null;
      throw e;
    });
  }
  return enginePromise;
}

const FORBIDDEN = /\b(insert|update|delete|drop|create|alter|attach|detach|copy|pragma|install|load|set|reset|export|import|call|truncate|grant|vacuum|checkpoint)\b/i;

/** Returns the single SELECT statement to run, or throws with an explanation. */
export function prepare(input: string): string {
  let sql = input.replace(/--[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").trim();
  sql = sql.replace(/;+\s*$/, "").trim();
  if (!sql) throw new SqlError("The editor is empty.", "Write a query that starts with SELECT.");
  const bare = sql.replace(/'(?:[^']|'')*'/g, "''").replace(/"(?:[^"]|"")*"/g, '""');
  if (bare.includes(";")) throw new SqlError("Only one statement can be run at a time.", "Remove the semicolon in the middle of your query, or run each statement separately.");
  if (!/^(select|with)\b/i.test(bare)) throw new SqlError("Queries here must start with SELECT or WITH.", "The practice database is read-only, so statements that change data or settings are not run.");
  const bad = bare.match(FORBIDDEN);
  if (bad) throw new SqlError(`${bad[0].toUpperCase()} is not available in the practice database.`, "It is read-only. Use SELECT to answer the question.");
  return sql;
}

function explain(message: string): string | undefined {
  if (/must appear in the GROUP BY clause/i.test(message)) return "Every column in SELECT must either be listed in GROUP BY or sit inside an aggregate such as SUM or COUNT.";
  if (/Referenced column .* not found|column .* does not exist/i.test(message)) return "Check the column name against the dataset panel. Column names use underscores, for example order_date.";
  if (/Table with name .* does not exist/i.test(message)) return `The available tables are ${TABLES.join(", ")}.`;
  if (/syntax error/i.test(message)) return "Look just before the position mentioned: a missing comma, an extra comma before FROM, or an unclosed bracket are the usual causes.";
  if (/Ambiguous reference/i.test(message)) return "The column exists in more than one table. Prefix it with the table name or alias, for example o.customer_id.";
  if (/WHERE clause cannot contain aggregates/i.test(message)) return "WHERE runs before grouping. Filter on an aggregate with HAVING instead.";
  return undefined;
}

function convert(v: unknown, type: string): Cell {
  if (v === null || v === undefined) return null;
  const temporal = /^(Date|Timestamp)/.test(type);
  if (v instanceof Date || (temporal && typeof v === "number")) {
    const iso = new Date(v as number | Date).toISOString();
    return /^Date/.test(type) || iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso.slice(0, 19).replace("T", " ");
  }
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "string") return v;
  return String(v);
}

export async function runQuery(input: string, schema: Schema = "main"): Promise<QueryResult> {
  const sql = prepare(input);
  const engine = await getEngine();
  const started = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const work = (async (): Promise<QueryResult> => {
    await engine.conn.query(`SET schema = '${schema}'`);
    const reader = await engine.conn.send(sql);
    let fields: { name: string; type: string }[] | null = null;
    const rows: Cell[][] = [];
    let truncated = false;
    for await (const batch of reader) {
      fields ??= batch.schema.fields.map((f: any) => ({ name: f.name, type: String(f.type) }));
      const cols = fields!.map((_, j) => batch.getChildAt(j));
      for (let i = 0; i < batch.numRows; i++) {
        if (rows.length >= ROW_LIMIT) {
          truncated = true;
          break;
        }
        rows.push(cols.map((c: any, j: number) => convert(c.get(i), fields![j].type)));
      }
      if (truncated) {
        await engine.conn.cancelSent();
        break;
      }
    }
    fields ??= (reader.schema?.fields ?? []).map((f: any) => ({ name: f.name, type: String(f.type) }));
    return { columns: fields!.map((f) => f.name), rows, truncated, ms: Math.round(performance.now() - started) };
  })();

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(async () => {
      enginePromise = null;
      try {
        await engine.db.terminate();
      } catch {
        /* already stopped */
      }
      reject(new SqlError(`The query ran for more than ${TIME_LIMIT_MS / 1000} seconds and was stopped.`, "This usually means a join is missing its ON condition, so every row is paired with every other row."));
    }, TIME_LIMIT_MS);
  });

  try {
    return await Promise.race([work, timeout]);
  } catch (e) {
    if (e instanceof SqlError) throw e;
    const message = (e instanceof Error ? e.message : String(e)).split("\n").filter((l) => l.trim()).slice(0, 4).join("\n");
    throw new SqlError(message, explain(message));
  } finally {
    clearTimeout(timer);
  }
}

/* ---- test-case validation ---- */

const key = (row: Cell[]) => JSON.stringify(row.map((v) => (typeof v === "number" ? Math.round(v * 10000) / 10000 : v)));

export type TestOutcome = { name: string; pass: boolean };
export type CheckResult = { pass: boolean; tests: TestOutcome[]; feedback: string; result: QueryResult | null };

function compare(got: QueryResult, want: QueryResult, ordered: boolean): string | null {
  if (got.columns.length !== want.columns.length)
    return `Your result has ${got.columns.length} column${got.columns.length === 1 ? "" : "s"}, but the answer needs ${want.columns.length}: ${want.columns.join(", ")}.`;
  if (got.rows.length !== want.rows.length) return `Your result has ${got.rows.length} row${got.rows.length === 1 ? "" : "s"}, but the answer has ${want.rows.length}. Check your filters and joins.`;
  const g = got.rows.map(key);
  const w = want.rows.map(key);
  const sameSet = [...g].sort().join("\n") === [...w].sort().join("\n");
  if (!sameSet) return "The number of rows and columns is right, but some values differ from the expected answer. Check the calculation and the order of your columns.";
  if (ordered && g.join("\n") !== w.join("\n")) return "You have the right rows, but in the wrong order. Check your ORDER BY, including the direction and any tie-breaker in the question.";
  return null;
}

/** Runs the learner's query and the reference query on two datasets and compares the results. */
export async function checkQuery(input: string, solution: string, ordered: boolean): Promise<CheckResult> {
  const cases: { name: string; schema: Schema }[] = [
    { name: "Practice database", schema: "main" },
    { name: "Second database with different data", schema: "chk" },
  ];
  const tests: TestOutcome[] = [];
  let feedback = "";
  let first: QueryResult | null = null;
  for (const c of cases) {
    const got = await runQuery(input, c.schema);
    const want = await runQuery(solution, c.schema);
    first ??= got;
    const problem = compare(got, want, ordered);
    tests.push({ name: c.name, pass: !problem });
    if (problem && !feedback)
      feedback =
        c.schema === "main"
          ? problem
          : "Your query matches on the practice database but not on a second database with different data. A value is probably typed in where it should be calculated, or a filter fits only the rows you can see.";
  }
  return { pass: tests.every((t) => t.pass), tests, feedback, result: first };
}
