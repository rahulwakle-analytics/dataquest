import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeList } from "@/components/practice/challenge-list";
import { PageHeader } from "@/components/page-header";
import { sqlChallenges, XP } from "@/content/sql-challenges";

export const metadata: Metadata = {
  title: "SQL Practice: write and run real queries",
  description: "Interactive SQL challenges that run in your browser on a real SQL engine and are checked against test cases. SELECT, joins, CTEs and window functions.",
  alternates: { canonical: "/practice/sql" },
};

export default function SqlPracticePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="SQL practice"
        title="Write the query. Run it. Prove it."
        lead="Each challenge gives you a business question against a real relational database — a retail business or an HR system. Your query runs on a real SQL engine in your browser and is checked against hidden test cases."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <ChallengeList
          challenges={sqlChallenges.map(({ slug, title, difficulty, topics }) => ({ slug, title, difficulty, topics }))}
          basePath="/practice/sql"
          idPrefix="practice-sql"
          xp={XP}
          progressLabel="SQL challenges solved"
        />
        <p className="mt-8 text-sm text-muted">
          New to SQL? Start with the{" "}
          <Link href="/paths/sql" className="font-medium text-primary underline-offset-4 hover:underline">
            SQL learning path
          </Link>
          . For spreadsheet practice, try the{" "}
          <Link href="/practice/excel" className="font-medium text-primary underline-offset-4 hover:underline">
            Excel Playground
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
