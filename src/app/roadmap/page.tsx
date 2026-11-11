import type { Metadata } from "next";
import { RoadmapView, type StageData } from "@/components/career/roadmap-view";
import { PageHeader } from "@/components/page-header";
import { flatTopics, getTool } from "@/content";
import { roadmap } from "@/content/career";

export const metadata: Metadata = {
  title: "Data Analyst Career Roadmap",
  description:
    "A nine-stage roadmap from data analytics fundamentals through Excel, SQL, statistics, Power BI and Python to projects, interviews and job readiness.",
  alternates: { canonical: "/roadmap" },
};

export default function RoadmapPage() {
  const stages: StageData[] = roadmap.map((s) => {
    const tool = s.path ? getTool(s.path) : undefined;
    if (!tool) return s;
    const all = flatTopics(tool);
    const written = all.filter((t) => t.hasLesson);
    return { ...s, pathName: tool.name, lessons: written.map((t) => ({ id: t.id, title: t.title })), planned: all.length - written.length };
  });
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Career roadmap"
        title="From first formula to first job"
        lead="Nine stages in the order that works. Each one says why it matters, what it depends on, what to learn and how to practise it."
      />
      <div className="mx-auto mt-12 max-w-4xl">
        <RoadmapView stages={stages} />
      </div>
    </div>
  );
}
