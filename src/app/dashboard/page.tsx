import type { Metadata } from "next";
import { XP, challengeId, sqlChallenges } from "@/content/sql-challenges";
import { XP as SHEET_XP, challengeId as sheetChallengeId, sheetChallenges } from "@/content/sheet-challenges";
import { XP as PBI_XP, challengeId as pbiChallengeId, powerbiExercises } from "@/content/powerbi-practice";
import { DashboardView, type DashboardPath } from "@/components/dashboard-view";
import { flatTopics, lessons, tools } from "@/content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your DataQuest progress: completed topics, solved exercises and learning history.",
  robots: { index: false },
};

export default function DashboardPage() {
  const paths: DashboardPath[] = tools.map((tool) => {
    const all = flatTopics(tool);
    return {
      slug: tool.slug,
      name: tool.name,
      totalTopics: all.length,
      topics: all
        .filter((t) => t.hasLesson)
        .map((t) => ({
          id: t.id,
          title: t.title,
          checks: lessons[t.id].checks.length,
          exercises: lessons[t.id].practice.map((q) => ({ title: q.title, checked: q.kind === "formula" || q.kind === "table" })),
        })),
    };
  });
  return (
    <DashboardView
      paths={paths}
      sql={sqlChallenges.map((c) => ({ id: challengeId(c.slug), xp: XP[c.difficulty] }))}
      sheet={sheetChallenges.map((c) => ({ id: sheetChallengeId(c.slug), xp: SHEET_XP[c.difficulty] }))}
      powerbi={powerbiExercises.map((c) => ({ id: pbiChallengeId(c.slug), xp: PBI_XP[c.difficulty] }))}
    />
  );
}
