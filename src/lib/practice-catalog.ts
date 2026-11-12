/**
 * A single cross-tool index of every practice challenge — SQL, Excel, Python and Power BI —
 * for the unified Practice page (the "LeetCode-style" problem table). Each tool's own content
 * file and workspace stay exactly as they are; this only reads from them to build one flat,
 * sortable, filterable list. Nothing here is invented: status comes from real saved progress
 * and view history, never a fabricated acceptance rate or solved count.
 */
import { challengeId as excelId, sheetChallenges, XP as EXCEL_XP } from "@/content/sheet-challenges";
import { challengeId as powerbiId, powerbiExercises, XP as POWERBI_XP } from "@/content/powerbi-practice";
import { challengeId as pythonId, pythonChallenges, XP as PYTHON_XP } from "@/content/python-challenges";
import { challengeId as sqlId, sqlChallenges, XP as SQL_XP } from "@/content/sql-challenges";

export type Tool = "SQL" | "Excel" | "Python" | "Power BI";
export const TOOLS: Tool[] = ["SQL", "Excel", "Python", "Power BI"];

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  tool: Tool;
  topics: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  xp: number;
  href: string;
};

function build(): CatalogItem[] {
  const sql = sqlChallenges.map((c) => ({ id: sqlId(c.slug), slug: c.slug, title: c.title, tool: "SQL" as const, topics: c.topics, difficulty: c.difficulty, xp: SQL_XP[c.difficulty], href: `/practice/sql/${c.slug}` }));
  const excel = sheetChallenges.map((c) => ({ id: excelId(c.slug), slug: c.slug, title: c.title, tool: "Excel" as const, topics: c.topics, difficulty: c.difficulty, xp: EXCEL_XP[c.difficulty], href: `/practice/excel/${c.slug}` }));
  const python = pythonChallenges.map((c) => ({ id: pythonId(c.slug), slug: c.slug, title: c.title, tool: "Python" as const, topics: c.topics, difficulty: c.difficulty, xp: PYTHON_XP[c.difficulty], href: `/practice/python/${c.slug}` }));
  // Power BI exercises live on one page (no per-exercise route), so they link to an anchor there.
  const powerbi = powerbiExercises.map((c) => ({
    id: powerbiId(c.slug),
    slug: c.slug,
    title: c.title,
    tool: "Power BI" as const,
    topics: [c.category],
    difficulty: c.difficulty,
    xp: POWERBI_XP[c.difficulty],
    href: `/practice/powerbi#${c.slug}`,
  }));
  return [...sql, ...excel, ...python, ...powerbi];
}

export const practiceCatalog: CatalogItem[] = build();
