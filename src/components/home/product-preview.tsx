"use client";

import { CheckCircle2, Flame, Play, RotateCcw, Send, Target, Trophy, XCircle, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { highlight } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/* ---- A tiny in-browser dataset and three candidate queries. Results are computed
        from the rows below, and Submit compares them with the reference result. ---- */

type Order = { order_id: number; region: string; status: string; amount: number };
type Row = Record<string, string | number>;

const ORDERS: Order[] = [
  { order_id: 1001, region: "North", status: "completed", amount: 420 },
  { order_id: 1002, region: "South", status: "completed", amount: 310 },
  { order_id: 1003, region: "North", status: "refunded", amount: 150 },
  { order_id: 1004, region: "West", status: "completed", amount: 560 },
  { order_id: 1005, region: "South", status: "completed", amount: 275 },
  { order_id: 1006, region: "West", status: "refunded", amount: 90 },
  { order_id: 1007, region: "North", status: "completed", amount: 380 },
  { order_id: 1008, region: "East", status: "completed", amount: 205 },
];

function revenueByRegion(rows: Order[]): Row[] {
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.region, (totals.get(r.region) ?? 0) + r.amount);
  return [...totals.entries()].map(([region, revenue]) => ({ region, revenue })).sort((a, b) => b.revenue - a.revenue);
}

const reference = (rows: Order[]) => revenueByRegion(rows.filter((r) => r.status === "completed"));

const QUERIES: { label: string; sql: string; run: (rows: Order[]) => Row[]; feedback: string }[] = [
  {
    label: "Query A",
    sql: `SELECT region, amount
FROM orders
WHERE status = 'completed'
ORDER BY amount DESC;`,
    run: (rows) =>
      rows
        .filter((r) => r.status === "completed")
        .sort((a, b) => b.amount - a.amount)
        .map(({ region, amount }) => ({ region, amount })),
    feedback:
      "This lists individual orders. The question asks for one row per region, so the amounts need SUM and a GROUP BY.",
  },
  {
    label: "Query B",
    sql: `SELECT region, SUM(amount) AS revenue
FROM orders
GROUP BY region
ORDER BY revenue DESC;`,
    run: (rows) => revenueByRegion(rows),
    feedback:
      "The grouping is right, but refunded orders are included, so North and West are overstated. Filter rows with WHERE before grouping.",
  },
  {
    label: "Query C",
    sql: `SELECT region, SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY region
ORDER BY revenue DESC;`,
    run: (rows) => reference(rows),
    feedback: "WHERE removes refunded orders, GROUP BY makes one row per region, and SUM totals each one.",
  },
];

function Sql({ code }: { code: string }) {
  const cls = { kw: "text-primary font-medium", str: "text-success", num: "text-warning", com: "text-muted", fn: "text-violet", plain: "" };
  return (
    <pre tabIndex={0} className="overflow-x-auto font-mono text-[13px] leading-relaxed">
      <code>
        {highlight(code, "sql").map((t, i) => (
          <span key={i} className={cls[t.kind]}>
            {t.text}
          </span>
        ))}
      </code>
    </pre>
  );
}

function ResultTable({ rows }: { rows: Row[] }) {
  const cols = Object.keys(rows[0] ?? {});
  return (
    <div tabIndex={0} role="region" aria-label="Table" className="overflow-x-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <table className="w-full text-left font-mono text-[13px]">
        <thead className="bg-surface text-muted">
          <tr>
            {cols.map((c) => (
              <th key={c} scope="col" className="px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {cols.map((c) => (
                <td key={c} className="px-3 py-1.5">
                  {r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SAMPLE = { streak: 6, baseXp: 1240, attempted: 47, solved: 38, week: [3, 5, 2, 6, 4, 0, 0] };
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const REWARD = 20;

export function ProductPreview() {
  const [tab, setTab] = useState("dashboard");
  const [pick, setPick] = useState(0);
  const [output, setOutput] = useState<Row[] | null>(null);
  const [verdict, setVerdict] = useState<"correct" | "incorrect" | null>(null);
  const [solved, setSolved] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const expected = useMemo(() => reference(ORDERS), []);
  const xp = SAMPLE.baseXp + (solved ? REWARD : 0);
  const attemptedCount = SAMPLE.attempted + (attempted ? 1 : 0);
  const solvedCount = SAMPLE.solved + (solved ? 1 : 0);
  const accuracy = Math.round((solvedCount / attemptedCount) * 100);
  const levelFloor = 1000;
  const levelCeil = 1500;

  const choose = (i: number) => {
    setPick(i);
    setOutput(null);
    setVerdict(null);
  };
  const run = () => setOutput(QUERIES[pick].run(ORDERS));
  const submit = () => {
    const result = QUERIES[pick].run(ORDERS);
    const ok = JSON.stringify(result) === JSON.stringify(expected);
    setOutput(result);
    setVerdict(ok ? "correct" : "incorrect");
    setAttempted(true);
    if (ok) setSolved(true); // XP is granted once, however many times you resubmit
  };
  const reset = () => {
    setPick(0);
    setOutput(null);
    setVerdict(null);
  };

  const status = solved ? "Correct" : attempted ? "Attempted" : "Not attempted";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-3">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="challenge">Challenge</TabsTrigger>
          </TabsList>
          <Badge variant="violet">Interactive preview · sample data</Badge>
        </div>

        <TabsContent value="dashboard" className="p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Welcome back</p>
              <p className="text-xl font-semibold tracking-tight">Sample learner</p>
            </div>
            <Badge variant="primary">Level 4 · Analyst</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Flame, label: "Day streak", value: `${SAMPLE.streak}`, tone: "text-warning" },
              { icon: Zap, label: "Total XP", value: xp.toLocaleString("en-US"), tone: "text-primary" },
              { icon: Target, label: "Accuracy", value: `${accuracy}%`, tone: "text-success" },
              { icon: Trophy, label: "Solved", value: `${solvedCount} / ${attemptedCount}`, tone: "text-violet" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                <s.icon className={cn("size-4", s.tone)} aria-hidden="true" />
                <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Level progress</span>
                <span className="tabular-nums text-muted">
                  {xp.toLocaleString("en-US")} / {levelCeil.toLocaleString("en-US")} XP
                </span>
              </div>
              <Progress className="mt-3" value={((xp - levelFloor) / (levelCeil - levelFloor)) * 100} label="Level progress" />
              <div className="mt-5 space-y-3">
                {[
                  { name: "SQL", pct: 62 },
                  { name: "Excel", pct: 35 },
                  { name: "Power BI", pct: 10 },
                ].map((p) => (
                  <div key={p.name} className="grid grid-cols-[72px_1fr_36px] items-center gap-3 text-sm">
                    <span className="text-muted">{p.name}</span>
                    <Progress value={p.pct} label={`${p.name} path progress`} />
                    <span className="text-right tabular-nums text-muted">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-medium">This week</p>
                <div className="mt-3 flex h-16 items-end gap-2" role="img" aria-label="Challenges solved per day this week">
                  {SAMPLE.week.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={cn("w-full rounded-sm", v ? "bg-primary" : "bg-border")}
                        style={{ height: `${Math.max(4, (v / 6) * 44)}px` }}
                      />
                      <span className="text-[10px] text-muted">{DAYS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Daily challenge</p>
                  <Badge variant={solved ? "success" : "neutral"}>{status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">Revenue by region · Easy · +{REWARD} XP</p>
                <Button size="sm" className="mt-3" onClick={() => setTab("challenge")}>
                  {solved ? "Review challenge" : "Open challenge"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenge" className="grid lg:grid-cols-2">
          <div className="space-y-4 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">Revenue by region</h3>
              <Badge variant="success">Easy</Badge>
              <Badge variant="primary">+{REWARD} XP</Badge>
              <Badge variant={solved ? "success" : "neutral"}>{status}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-foreground">Business scenario.</span> The sales director wants total
              revenue for each region, counting completed orders only, with the strongest region first.
            </p>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Table: orders</p>
              <ResultTable rows={ORDERS} />
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            <div role="radiogroup" aria-label="Choose a query" className="flex gap-2">
              {QUERIES.map((q, i) => (
                <button
                  key={q.label}
                  type="button"
                  role="radio"
                  aria-checked={pick === i}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    pick === i ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted hover:text-foreground",
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <Sql code={QUERIES[pick].sql} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={run}>
                <Play /> Run
              </Button>
              <Button size="sm" onClick={submit}>
                <Send /> Submit
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw /> Reset
              </Button>
            </div>

            <div aria-live="polite" className="space-y-3">
              {output ? (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Output · {output.length} rows</p>
                  <ResultTable rows={output} />
                </>
              ) : (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">
                  Pick a query, then Run to see its result or Submit to check it.
                </p>
              )}
              {verdict && (
                <p
                  className={cn(
                    "flex items-start gap-2 rounded-lg border p-3 text-sm",
                    verdict === "correct" ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10",
                  )}
                >
                  {verdict === "correct" ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />
                  )}
                  <span>
                    <strong className="font-semibold">{verdict === "correct" ? "Correct." : "Incorrect."}</strong>{" "}
                    {QUERIES[pick].feedback}
                  </span>
                </p>
              )}
            </div>
            <p className="text-xs text-muted">
              This preview runs three prepared queries on eight rows in your browser. Free-form SQL against PostgreSQL
              is in development.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
