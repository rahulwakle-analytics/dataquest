import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeList } from "@/components/practice/challenge-list";
import { PageHeader } from "@/components/page-header";
import { pythonChallenges, XP } from "@/content/python-challenges";

export const metadata: Metadata = {
  title: "Python Practice: write and run real pandas code",
  description: "Interactive Python challenges that run in your browser on a real CPython interpreter (Pyodide) with numpy and pandas, checked against two datasets so hardcoded answers don't pass.",
  alternates: { canonical: "/practice/python" },
};

export default function PythonPracticePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Python practice"
        title="Write the code. Run it. Prove it."
        lead="Each challenge gives you a short business task over plain Python or a pandas DataFrame. Your code runs on a real Python interpreter in your browser and is checked against a second dataset with different numbers, so a value that happens to work by luck doesn't pass."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <ChallengeList
          challenges={pythonChallenges.map(({ slug, title, difficulty, topics }) => ({ slug, title, difficulty, topics }))}
          basePath="/practice/python"
          idPrefix="practice-python"
          xp={XP}
          progressLabel="Python challenges solved"
        />
        <p className="mt-8 text-sm text-muted">
          New to Python? Start with the{" "}
          <Link href="/paths/python" className="font-medium text-primary underline-offset-4 hover:underline">
            Python learning path
          </Link>
          . For query practice, try the{" "}
          <Link href="/practice/sql" className="font-medium text-primary underline-offset-4 hover:underline">
            SQL Playground
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
