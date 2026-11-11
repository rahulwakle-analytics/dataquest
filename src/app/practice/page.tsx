import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeList } from "@/components/practice/challenge-list";
import { PageHeader } from "@/components/page-header";
import { sqlChallenges } from "@/content/sql-challenges";

export const metadata: Metadata = {
  title: "SQL Practice: write and run real queries",
  description: "Interactive SQL challenges that run in your browser on a real SQL engine and are checked against test cases. SELECT, joins, CTEs and window functions.",
  alternates: { canonical: "/practice" },
};

export default function PracticePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="SQL practice"
        title="Write the query. Run it. Prove it."
        lead="Each challenge gives you a business question and a retail database. Your query runs on a real SQL engine in your browser and is checked against test cases."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <ChallengeList challenges={sqlChallenges.map(({ slug, title, difficulty, topics, task }) => ({ slug, title, difficulty, topics, task }))} />
        <p className="mt-8 text-sm text-muted">
          New to SQL? Start with the{" "}
          <Link href="/paths/sql" className="font-medium text-primary underline-offset-4 hover:underline">
            SQL learning path
          </Link>
          . For spreadsheet practice, the{" "}
          <Link href="/paths/excel" className="font-medium text-primary underline-offset-4 hover:underline">
            Excel lessons
          </Link>{" "}
          have checked formula exercises.
        </p>
      </div>
    </div>
  );
}
