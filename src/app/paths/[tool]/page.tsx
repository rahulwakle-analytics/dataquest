import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { TopicList } from "@/components/learn/topic-list";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { flatTopics, getTool, toolStats, tools } from "@/content";
import { sqlSchema } from "@/content/paths";

type Props = { params: Promise<{ tool: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).tool);
  if (!tool) return {};
  const title = `Learn ${tool.name}: topics, lessons and practice`;
  return {
    title,
    description: tool.description,
    alternates: { canonical: `/paths/${tool.slug}` },
    openGraph: { title, description: tool.description, url: `/paths/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: Props) {
  const tool = getTool((await params).tool);
  if (!tool) notFound();
  const stats = toolStats(tool);
  const topics = flatTopics(tool);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${tool.name} for data analysts`,
    description: tool.description,
    provider: { "@type": "Organization", name: "DataQuest" },
  };

  return (
    <div className="container py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/paths" className="hover:text-foreground">
          Learning Paths
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <header className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <ToolIcon tool={tool.slug} className="size-14" />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Learn {tool.name}</h1>
          <p className="mt-2 text-lg font-medium text-primary">{tool.tagline}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{tool.description}</p>
          {stats.first && (
            <Button asChild size="lg" className="mt-7">
              <Link href={`/paths/${stats.first.id}`}>
                Start with {stats.first.title} <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center">
          {[
            { k: "Topics", v: stats.topics },
            { k: "Lessons available", v: stats.lessons },
            { k: "Levels", v: tool.levels.length },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-card p-4">
              <dd className="text-3xl font-semibold tabular-nums tracking-tight">{s.v}</dd>
              <dt className="mt-1 text-xs text-muted">{s.k}</dt>
            </div>
          ))}
        </dl>
      </header>

      {stats.lessons < stats.topics && (
        <p className="mt-8 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          This path is being written. {stats.lessons} of {stats.topics} topics have a full lesson; the rest show their
          outline and are marked “In development”.
        </p>
      )}

      {tool.slug === "sql" && (
        <section className="mt-10" aria-labelledby="schema">
          <h2 id="schema" className="text-xl font-semibold tracking-tight">
            The practice database
          </h2>
          <p className="mt-2 max-w-2xl text-muted">Every SQL lesson and question uses the same four retail tables.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {sqlSchema.map((t) => (
              <div key={t.table} className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-sm font-semibold text-primary">{t.table}</p>
                <p className="mt-1.5 font-mono text-[13px] leading-relaxed text-muted">{t.columns}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <TopicList
          toolName={tool.name}
          levels={tool.levels.map((l) => ({
            name: l.name,
            level: l.level,
            topics: l.topics.map((t) => {
              const ft = topics.find((x) => x.slug === t.slug)!;
              return { id: ft.id, href: `/paths/${ft.id}`, title: t.title, blurb: t.blurb, hasLesson: ft.hasLesson };
            }),
          }))}
        />
      </div>
    </div>
  );
}
