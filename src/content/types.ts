export type Difficulty = "Easy" | "Medium" | "Hard";

export type Lesson = {
  /** One-sentence summary, also used for page metadata. */
  summary: string;
  explanation: string[];
  syntax: string;
  examples: { title: string; code: string; note: string }[];
  scenario: { title: string; body: string; code?: string };
  mistakes: { mistake: string; fix: string }[];
  practice: { title: string; prompt: string; difficulty: Difficulty; hint: string; solution: string }[];
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

export type Project = {
  slug: string;
  title: string;
  tools: string[];
  problem: string;
  objectives: string[];
  dataset: string;
  tasks: string[];
  deliverables: string[];
};
