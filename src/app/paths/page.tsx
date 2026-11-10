import type { Metadata } from "next";
import { PathCard } from "@/components/learn/path-card";
import { toolStats, tools } from "@/content";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Structured learning paths for Excel, SQL, Power BI, Python and Tableau, from fundamentals to advanced.",
  alternates: { canonical: "/paths" },
};

export default function PathsPage() {
  return (
    <div className="container py-14 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Learning paths</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Choose what to get good at</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Each path runs from fundamentals to advanced. Complete a topic by answering its knowledge checks correctly.
        </p>
      </header>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const s = toolStats(tool);
          return (
            <PathCard
              key={tool.slug}
              path={{
                slug: tool.slug,
                name: tool.name,
                tagline: tool.tagline,
                description: tool.description,
                difficulty: tool.difficulty,
                topics: s.topics,
                lessonIds: s.lessonIds,
                firstHref: s.first ? `/paths/${s.first.id}` : `/paths/${tool.slug}`,
              }}
            />
          );
        })}
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
        Progress is stored in this browser. Signing in to sync it across devices is in development.
      </p>
    </div>
  );
}
