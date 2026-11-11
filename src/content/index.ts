import { tools } from "./paths";
import { sqlCore } from "./lessons/sql-core";
import { sqlAdvanced } from "./lessons/sql-advanced";
import { excel } from "./lessons/excel";
import { starters } from "./lessons/starters";
import { beginner } from "./lessons/beginner";
import { extras } from "./lessons/extras";
import type { Lesson, Level, Tool, TopicRef } from "./types";

const base: Record<string, Lesson> = { ...sqlCore, ...sqlAdvanced, ...starters, ...excel, ...beginner };

/** Every lesson, with objectives and interview questions merged in where they are kept separately. */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  Object.entries(base).map(([id, lesson]) => [id, { ...extras[id], ...lesson }]),
);

export const topicId = (tool: string, topic: string) => `${tool}/${topic}`;

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export type FlatTopic = TopicRef & { tool: Tool; level: Level; id: string; hasLesson: boolean };

export function flatTopics(tool: Tool): FlatTopic[] {
  return tool.levels.flatMap((level) =>
    level.topics.map((topic) => {
      const id = topicId(tool.slug, topic.slug);
      return { ...topic, tool, level, id, hasLesson: id in lessons };
    }),
  );
}

export function toolStats(tool: Tool) {
  const all = flatTopics(tool);
  const written = all.filter((t) => t.hasLesson);
  return { topics: all.length, lessons: written.length, lessonIds: written.map((t) => t.id), first: written[0] };
}

/** Practice questions surfaced on the homepage. Each links to the lesson that contains it. */
export const featuredChallenges = [
  { id: "sql/group-by", index: 0 },
  { id: "sql/left-join", index: 0 },
  { id: "sql/case-when", index: 1 },
  { id: "sql/window-functions", index: 1 },
  { id: "sql/ranking", index: 0 },
  { id: "excel/formulas-and-cell-references", index: 4 },
].map(({ id, index }) => {
  const [toolSlug, topicSlug] = id.split("/");
  const tool = getTool(toolSlug)!;
  const topic = flatTopics(tool).find((t) => t.slug === topicSlug)!;
  const q = lessons[id].practice[index];
  return { ...q, tool, topic, href: `/paths/${toolSlug}/${topicSlug}#practice` };
});

export { tools };
