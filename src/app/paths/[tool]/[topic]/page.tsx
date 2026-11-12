import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/career/reveal";
import { AlertTriangle, GraduationCap, Target, ArrowLeft, ArrowRight, Briefcase, ChevronRight, Hammer, Menu } from "lucide-react";
import { CodeBlock } from "@/components/learn/code-block";
import { KnowledgeCheck } from "@/components/learn/knowledge-check";
import { LessonSidebar, type SidebarLevel } from "@/components/learn/lesson-sidebar";
import { PracticeQuestion } from "@/components/learn/practice-question";
import { SqlLessonExercise } from "@/components/learn/sql-lesson-exercise";
import { SqlTryIt } from "@/components/learn/sql-try-it";
import { TopicStatus } from "@/components/learn/topic-status";
import { SheetExercise } from "@/components/practice/sheet-exercise";
import { SheetPlayground } from "@/components/practice/sheet-playground";
import { TableExercise } from "@/components/practice/table-exercise";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flatTopics, getTool, lessons, tools } from "@/content";
import { FUNCTIONS } from "@/lib/sheet/engine";

type Props = { params: Promise<{ tool: string; topic: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return tools.flatMap((t) => flatTopics(t).map((x) => ({ tool: t.slug, topic: x.slug })));
}

async function load(params: Props["params"]) {
  const { tool: toolSlug, topic: topicSlug } = await params;
  const tool = getTool(toolSlug);
  if (!tool) return null;
  const all = flatTopics(tool);
  const i = all.findIndex((t) => t.slug === topicSlug);
  if (i < 0) return null;
  return { tool, topic: all[i], prev: all[i - 1], next: all[i + 1], lesson: lessons[all[i].id], all };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { tool, topic, lesson } = data;
  const title = `${topic.title} in ${tool.name}: explanation, examples and practice`;
  const description = lesson?.summary ?? topic.blurb;
  const url = `/paths/${topic.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: lesson ? undefined : { index: false },
    openGraph: { type: "article", title, description, url },
  };
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default async function TopicPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { tool, topic, prev, next, lesson, all } = data;
  const nextLesson = all.slice(all.findIndex((t) => t.id === topic.id) + 1).find((t) => t.hasLesson);
  const isSql = tool.lang === "sql";

  const sidebarLevels: SidebarLevel[] = tool.levels.map((l) => ({
    name: l.name,
    level: l.level,
    topics: l.topics.map((t) => {
      const ft = all.find((x) => x.slug === t.slug)!;
      return { id: ft.id, href: `/paths/${ft.id}`, title: t.title, hasLesson: ft.hasLesson };
    }),
  }));
  const sidebar = (
    <details className="group rounded-xl border border-border bg-card lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="flex items-center gap-2">
          <Menu className="size-4" aria-hidden="true" /> {tool.name} topics
        </span>
        <ChevronRight className="size-4 text-muted transition-transform group-open:rotate-90" aria-hidden="true" />
      </summary>
      <div className="border-t border-border p-3">
        <LessonSidebar levels={sidebarLevels} currentId={topic.id} />
      </div>
    </details>
  );

  const crumbs = (
    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
      <Link href="/paths" className="hover:text-foreground">
        Learning Paths
      </Link>
      <ChevronRight className="size-3.5" aria-hidden="true" />
      <Link href={`/paths/${tool.slug}`} className="hover:text-foreground">
        {tool.name}
      </Link>
      <ChevronRight className="size-3.5" aria-hidden="true" />
      <span className="text-foreground">{topic.title}</span>
    </nav>
  );

  const pager = (
    <nav aria-label="Topics" className="mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={`/paths/${prev.id}`} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50">
          <span className="flex items-center gap-1 text-xs text-muted">
            <ArrowLeft className="size-3.5" /> Previous
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`/paths/${next.id}`} className="rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-primary/50">
          <span className="flex items-center justify-end gap-1 text-xs text-muted">
            Next <ArrowRight className="size-3.5" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  );

  if (!lesson) {
    const available = all.filter((t) => t.hasLesson);
    return (
      <div className="container py-10 sm:py-14">
        {crumbs}
        {sidebar}
        <div className="mt-6 grid gap-10 lg:mt-0 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <LessonSidebar levels={sidebarLevels} currentId={topic.id} />
            </div>
          </aside>
          <div className="max-w-3xl">
            <Badge variant={difficultyVariant(topic.level.level)}>{topic.level.name}</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">{topic.title}</h1>
            <p className="mt-3 text-lg text-muted">{topic.blurb}</p>
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <Hammer className="mx-auto size-8 text-muted" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">This lesson has not been written yet</h2>
              <p className="mx-auto mt-2 max-w-md text-muted">
                It is part of the {tool.name} outline and is in development. These {tool.name} lessons are ready now:
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {available.map((t) => (
                  <Button key={t.id} asChild variant="secondary" size="sm">
                    <Link href={`/paths/${t.id}`}>{t.title}</Link>
                  </Button>
                ))}
                <Button asChild size="sm">
                  <Link href="/paths/sql">Go to the SQL path</Link>
                </Button>
              </div>
            </div>
            {pager}
          </div>
        </div>
      </div>
    );
  }

  const interactive = lesson.practice.some((q) => q.kind === "formula" || q.kind === "table" || q.kind === "sql");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${topic.title} in ${tool.name}`,
    description: lesson.summary,
    educationalLevel: topic.level.level,
    learningResourceType: "Lesson",
    isPartOf: { "@type": "Course", name: `${tool.name} for data analysts` },
  };

  return (
    <div className="container py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {crumbs}
      {sidebar}
      <div className="mt-6 grid gap-10 lg:mt-0 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <LessonSidebar levels={sidebarLevels} currentId={topic.id} />
          </div>
        </aside>
        <article className="min-w-0 max-w-3xl">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={difficultyVariant(topic.level.level)}>{topic.level.name}</Badge>
              <TopicStatus topicId={topic.id} total={lesson.checks.length} />
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{topic.title}</h1>
            <p className="mt-4 text-xl leading-relaxed text-muted">{lesson.summary}</p>
          </header>

          {lesson.objectives && (
            <section aria-labelledby="objectives" className="mt-8 rounded-2xl border border-border bg-card p-5">
              <h2 id="objectives" className="flex items-center gap-2 font-semibold">
                <Target className="size-4 text-primary" aria-hidden="true" /> After this lesson you can
              </h2>
              <ul className="mt-3 space-y-1.5">
                {lesson.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 space-y-14">
            <section aria-labelledby="explanation">
              <H2 id="explanation">Explanation</H2>
              <div className="mt-4 space-y-4 text-[17px] leading-relaxed">
                {lesson.explanation.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="syntax">
              <H2 id="syntax">Syntax</H2>
              <CodeBlock code={lesson.syntax} lang={tool.lang} className="mt-4" />
            </section>

            <section aria-labelledby="examples">
              <H2 id="examples">Practical examples</H2>
              <div className="mt-4 space-y-6">
                {lesson.examples.map((ex) => (
                  <div key={ex.title}>
                    <h3 className="font-semibold">{ex.title}</h3>
                    <CodeBlock code={ex.code} lang={tool.lang} className="mt-2" />
                    <p className="mt-2 text-muted">{ex.note}</p>
                    {isSql && <SqlTryIt code={ex.code} />}
                  </div>
                ))}
              </div>
            </section>

            {lesson.playground && (
              <section aria-labelledby="try-it">
                <H2 id="try-it">Try it</H2>
                <div className="mt-4">
                  <SheetPlayground playground={lesson.playground} />
                </div>
              </section>
            )}

            <section aria-labelledby="scenario">
              <H2 id="scenario">Business scenario</H2>
              <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Briefcase className="size-4 text-primary" aria-hidden="true" />
                  {lesson.scenario.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{lesson.scenario.body}</p>
                {lesson.scenario.code && (
                  <>
                    <CodeBlock code={lesson.scenario.code} lang={tool.lang} className="mt-4 bg-card" />
                    {isSql && <SqlTryIt code={lesson.scenario.code} />}
                  </>
                )}
              </div>
            </section>

            <section aria-labelledby="mistakes">
              <H2 id="mistakes">Common mistakes</H2>
              <ul className="mt-4 space-y-3">
                {lesson.mistakes.map((m) => (
                  <li key={m.mistake} className="rounded-xl border border-border bg-card p-4">
                    <p className="flex items-start gap-2 font-medium">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
                      {m.mistake}
                    </p>
                    <p className="mt-1.5 pl-6 text-muted">{m.fix}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="practice">
              <H2 id="practice">Practice your skills</H2>
              <p className="mt-2 text-muted">
                {interactive
                  ? "Your answers are run for real and checked against test cases, never by matching keywords. Hints come one at a time, and the solution stays hidden until you ask for it."
                  : "Try each one before you open a hint or the solution."}
              </p>
              {lesson.practice.some((q) => q.kind === "formula") && (
                <p className="mt-2 text-xs text-muted">
                  Formulas run on DataQuest's own calculation engine, which supports a subset of Excel ({FUNCTIONS.length} functions, A1 and
                  structured references). It does not open Excel workbooks.
                </p>
              )}
              <div className="mt-4 space-y-4">
                {lesson.practice.map((q, i) =>
                  q.kind === "formula" ? (
                    <SheetExercise key={q.title} topicId={topic.id} index={i} question={q} />
                  ) : q.kind === "table" ? (
                    <TableExercise key={q.title} topicId={topic.id} index={i} question={q} />
                  ) : q.kind === "sql" ? (
                    <SqlLessonExercise key={q.title} topicId={topic.id} index={i} question={q} />
                  ) : (
                    <PracticeQuestion key={q.title} index={i} lang={tool.lang} question={q} />
                  ),
                )}
              </div>
            </section>

            {lesson.interview && (
              <section aria-labelledby="interview">
                <H2 id="interview">Interview questions</H2>
                <p className="mt-2 text-muted">Questions an interviewer might ask on this topic. Answer aloud first, then compare.</p>
                <ul className="mt-4 space-y-3">
                  {lesson.interview.map((iq) => (
                    <li key={iq.q} className="rounded-2xl border border-border bg-card p-5">
                      <p className="font-medium">{iq.q}</p>
                      <div className="mt-3">
                        <Reveal label="model answer">
                          <p className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed">{iq.a}</p>
                        </Reveal>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="checks">
              <H2 id="checks">Knowledge check</H2>
              <p className="mb-4 mt-2 text-muted">Answer every question correctly to complete this topic.</p>
              <KnowledgeCheck topicId={topic.id} checks={lesson.checks} />
            </section>
          </div>

          {nextLesson ? (
            <Link
              href={`/paths/${nextLesson.id}`}
              className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-violet/10 p-6 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  <GraduationCap className="size-4" aria-hidden="true" /> Recommended next lesson
                </span>
                <span className="mt-1 block text-xl font-semibold tracking-tight">{nextLesson.title}</span>
                <span className="mt-1 block text-sm text-muted">{nextLesson.blurb}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/roadmap"
              className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-violet/10 p-6 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  <GraduationCap className="size-4" aria-hidden="true" /> You have reached the last written {tool.name} lesson
                </span>
                <span className="mt-1 block text-xl font-semibold tracking-tight">See what comes next on the roadmap</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </Link>
          )}

          {pager}
        </article>
      </div>
    </div>
  );
}
