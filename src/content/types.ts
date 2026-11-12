import type { FormulaTask } from "@/lib/sheet/check";
import type { SheetSpec } from "@/lib/sheet/engine";
import type { Dataset, View } from "@/lib/table-practice";
import type { DatabaseId } from "@/lib/sql/databases";

export type Difficulty = "Easy" | "Medium" | "Hard";

type QuestionBase = {
  title: string;
  prompt: string;
  difficulty: Difficulty;
  /** Progressive hints, from a nudge to nearly the answer. `hint` is the single-hint form. */
  hints?: string[];
  hint?: string;
  /** Why the solution works. */
  explanation?: string;
};

/** Read, attempt, then compare with a model answer. */
export type TextQuestion = QuestionBase & { kind?: "text"; solution: string };
/** Write a formula in a spreadsheet; checked by calculating it against test cases. */
export type FormulaQuestion = QuestionBase & { kind: "formula" } & FormulaTask;
/** Sort and filter a table; the resulting view is checked. */
export type TableQuestion = QuestionBase & {
  kind: "table";
  dataset: Dataset;
  goal: View;
  /** Hand-checked row ids, in order. Used by the content verification script. */
  expectIds: number[];
  steps: string[];
};
/**
 * A SQL question embedded directly in a lesson, checked the same way the SQL Playground checks
 * challenges: the learner's query and the reference solution are both run for real against
 * DuckDB (on two differently-sized datasets, to catch a hardcoded answer) and their results
 * compared. Never checked by matching keywords in the query text.
 */
export type SqlLessonQuestion = QuestionBase & {
  kind: "sql";
  database?: DatabaseId;
  columns: string[];
  /** Whether row order is part of the answer. */
  ordered: boolean;
  solution: string;
  /** Queries that must be rejected. Used by the content verification script. */
  wrong?: string[];
  starter?: string;
};
export type PracticeItem = TextQuestion | FormulaQuestion | TableQuestion | SqlLessonQuestion;

export type Playground = { title: string; intro: string; sheet: SheetSpec; target: string; fill: string; initial: string; tryThese: string[] };

export type Lesson = {
  /** One-sentence summary, also used for page metadata. */
  summary: string;
  /** What the learner will be able to do afterwards. */
  objectives?: string[];
  explanation: string[];
  syntax: string;
  examples: { title: string; code: string; note: string }[];
  /** Optional hands-on example shown after the worked examples. */
  playground?: Playground;
  scenario: { title: string; body: string; code?: string };
  mistakes: { mistake: string; fix: string }[];
  practice: PracticeItem[];
  /** Questions an interviewer might ask on this topic, with model answers. */
  interview?: { q: string; a: string }[];
  checks: { q: string; options: string[]; answer: number; why: string }[];
};

export type TopicRef = { slug: string; title: string; blurb: string };

export type Level = { name: string; level: "Beginner" | "Intermediate" | "Advanced"; topics: TopicRef[] };

export type Tool = {
  slug: string;
  name: string;
  /** Language used for code blocks in this path. */
  lang: "sql" | "python" | "excel" | "dax" | "tableau";
  tagline: string;
  description: string;
  difficulty: string;
  levels: Level[];
};

export type ProjectTask = {
  instruction: string;
  /** A nudge, shown before the solution. */
  hint: string;
  /** What a correct result looks like — concrete enough to self-check against. */
  expectedOutput: string;
  /** A worked solution: a formula, query or short walkthrough. */
  solution: string;
};

export type Project = {
  slug: string;
  title: string;
  tools: string[];
  problem: string;
  objectives: string[];
  /** Dataset slug in content/datasets.ts, for the downloadable-data link. */
  datasetSlug: string;
  dataset: string;
  tasks: ProjectTask[];
  deliverables: string[];
  /** Polished, shareable artifacts a finished run of this project leaves you with. */
  portfolioDeliverables: string[];
};
