import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Sheet, Terminal } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { UnifiedPracticeTable } from "@/components/practice/unified-practice-table";
import { practiceCatalog } from "@/lib/practice-catalog";
import { sqlChallenges, XP as SQL_XP } from "@/content/sql-challenges";
import { sheetChallenges, sortFilterChallenges, XP as SHEET_XP } from "@/content/sheet-challenges";
import { pythonChallenges, XP as PYTHON_XP } from "@/content/python-challenges";

export const metadata: Metadata = {
  title: "Practice Lab: real SQL, Excel, Python and Power BI exercises",
  description: "Hands-on practice that actually runs: SQL queries on a real browser database, an editable spreadsheet checked by calculation, Python/pandas on a real interpreter, and guided Power BI exercises.",
  alternates: { canonical: "/practice" },
};

export default function PracticePage() {
  const sqlXp = sqlChallenges.reduce((n, c) => n + SQL_XP[c.difficulty], 0);
  const sheetXp = sheetChallenges.reduce((n, c) => n + SHEET_XP[c.difficulty], 0);
  const sortFilterCount = sortFilterChallenges.length;
  const pythonXp = pythonChallenges.reduce((n, c) => n + PYTHON_XP[c.difficulty], 0);

  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Practice lab"
        title="Don't just read about it. Do it."
        lead="Four hands-on tracks: a real SQL engine, an editable spreadsheet checked by calculation, a real Python interpreter with pandas, and guided Power BI exercises. Everything here runs and is actually checked. Jump into any problem directly — no lesson required first."
      />
      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        <Link href="/practice/sql" className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
          <Terminal className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">SQL Playground</h2>
          <p className="mt-1.5 text-sm text-muted">{sqlChallenges.length} challenges, real execution on DuckDB in your browser. SELECT, JOINs, CTEs, window functions. {sqlXp} XP total.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link href="/practice/excel" className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
          <Sheet className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">Excel Playground</h2>
          <p className="mt-1.5 text-sm text-muted">
            {sheetChallenges.length} formula challenges plus {sortFilterCount} sort-and-filter exercises on an editable grid, checked by calculated result. {sheetXp} XP total.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link href="/practice/python" className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
          <Code2 className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">Python Playground</h2>
          <p className="mt-1.5 text-sm text-muted">{pythonChallenges.length} challenges, real execution on a CPython interpreter (Pyodide) with numpy and pandas in your browser. {pythonXp} XP total.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link href="/practice/powerbi" className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
          <h2 className="text-lg font-semibold">Power BI Practice Lab</h2>
          <p className="mt-1.5 text-sm text-muted">Guided, simulated exercises on data modelling, DAX, measures vs. calculated columns, and dashboard design — not a Power BI Desktop replica.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-xl font-semibold">All problems</h2>
        <p className="mt-1 text-sm text-muted">Every SQL, Excel, Python and Power BI problem in one searchable, filterable list.</p>
        <div className="mt-5">
          <UnifiedPracticeTable items={practiceCatalog} />
        </div>
      </div>
    </div>
  );
}
