import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeList } from "@/components/practice/challenge-list";
import { PageHeader } from "@/components/page-header";
import { TableExercise } from "@/components/practice/table-exercise";
import { sheetChallenges, sortFilterChallenges, XP } from "@/content/sheet-challenges";

export const metadata: Metadata = {
  title: "Excel Practice: an editable spreadsheet, checked by calculation",
  description: "Interactive spreadsheet exercises with SUM, AVERAGE, COUNT, IF, SUMIFS and XLOOKUP, plus sort-and-filter challenges, all checked against calculated results.",
  alternates: { canonical: "/practice/excel" },
};

export default function ExcelPracticePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Excel practice"
        title="A real spreadsheet. Checked by calculation."
        lead="Fill in the highlighted cells with your own formulas. Every answer is graded by computing its value, not by matching the text of a formula."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <ChallengeList
          challenges={sheetChallenges.map(({ slug, title, difficulty, topics }) => ({ slug, title, difficulty, topics }))}
          basePath="/practice/excel"
          idPrefix="practice-excel"
          xp={XP}
          progressLabel="Excel challenges solved"
        />

        <section className="mt-14" aria-labelledby="sort-filter-h">
          <h2 id="sort-filter-h" className="mb-3 text-xl font-semibold tracking-tight">
            Sort &amp; filter practice
          </h2>
          <p className="mb-5 text-sm text-muted">Arrange an inventory table with sort and filter controls, the same way you would in Excel's menus. The resulting view is what's checked.</p>
          <div className="space-y-5">
            {sortFilterChallenges.map((c) => (
              <TableExercise key={c.slug} topicId={`practice-excel/${c.slug}`} index={0} question={c.question} />
            ))}
          </div>
        </section>

        <p className="mt-8 text-sm text-muted">
          New to spreadsheets? Start with the{" "}
          <Link href="/paths/excel" className="font-medium text-primary underline-offset-4 hover:underline">
            Excel learning path
          </Link>
          . For database practice, try the{" "}
          <Link href="/practice/sql" className="font-medium text-primary underline-offset-4 hover:underline">
            SQL Playground
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
