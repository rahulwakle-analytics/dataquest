import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Checklist } from "@/components/career/checklist";
import { MockInterview } from "@/components/career/mock-interview";
import { QuestionBank } from "@/components/career/question-bank";
import { Reveal } from "@/components/career/reveal";
import { Block, PageHeader, SectionNav } from "@/components/page-header";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { flatTopics, getTool, lessons } from "@/content";
import { caseStudies, interviewQuestions, linkedin, portfolio, resume, roleProfiles } from "@/content/career";

export const metadata: Metadata = {
  title: "Career Centre: resume, portfolio and interview preparation for data analysts",
  description:
    "Build a data analyst resume and portfolio, improve your LinkedIn profile, practise interview questions, SQL problems and business case studies, and compare your skills with real role requirements.",
  alternates: { canonical: "/career" },
};

const nav = [
  { href: "#resume", label: "Resume" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#linkedin", label: "LinkedIn" },
  { href: "#questions", label: "Interview questions" },
  { href: "#mock", label: "Mock interview" },
  { href: "#sql", label: "SQL interview practice" },
  { href: "#cases", label: "Case studies" },
  { href: "#roles", label: "Job requirements" },
];

function Tips({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((t) => (
        <Card key={t.title} className="p-5">
          <h3 className="font-semibold">{t.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
        </Card>
      ))}
    </div>
  );
}

export default function CareerPage() {
  const sqlTool = getTool("sql")!;
  const sqlSet = flatTopics(sqlTool)
    .filter((t) => t.hasLesson)
    .flatMap((t) => lessons[t.id].practice.filter((q) => q.difficulty !== "Easy").map((q) => ({ ...q, topic: t.title, href: `/paths/${t.id}#practice` })));

  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Career centre"
        title="Turn your skills into a job offer"
        lead="Practical guidance and practice for the last stretch: being found, being shortlisted and performing in the interview."
      />
      <SectionNav label="Career centre sections" links={nav} />

      <div className="mx-auto mt-10 max-w-5xl">
        <Block id="resume" title="Resume building" lead={resume.intro}>
          <Tips items={resume.principles} />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-danger">Weak bullet</p>
              <p className="mt-2 leading-relaxed">{resume.before}</p>
            </div>
            <div className="rounded-xl border border-success/30 bg-success/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-success">Stronger bullet</p>
              <p className="mt-2 leading-relaxed">{resume.after}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">The second bullet is an example of the shape. Use your own real numbers.</p>
          <h3 className="mb-3 mt-8 font-semibold">Resume checklist</h3>
          <Checklist group="career:resume" items={resume.checklist.map((label) => ({ label }))} />
        </Block>

        <Block id="portfolio" title="Portfolio creation" lead={portfolio.intro}>
          <h3 className="font-semibold">How to write up each project</h3>
          <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {portfolio.structure.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs font-semibold text-primary">Part {i + 1}</span>
                <h4 className="mt-1 text-sm font-semibold">{s.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-8 font-semibold">A balanced set of three</h3>
          <ul className="mt-3 space-y-2 text-muted">
            {portfolio.mix.map((m) => (
              <li key={m} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/projects" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
              Choose from the five project briefs <ArrowRight className="size-4" />
            </Link>
          </p>
          <h3 className="mb-3 mt-8 font-semibold">Portfolio checklist</h3>
          <Checklist group="career:portfolio" items={portfolio.checklist.map((label) => ({ label }))} />
        </Block>

        <Block id="linkedin" title="LinkedIn optimization" lead={linkedin.intro}>
          <Tips items={linkedin.tips} />
          <h3 className="mb-3 mt-8 font-semibold">LinkedIn checklist</h3>
          <Checklist group="career:linkedin" items={linkedin.checklist.map((label) => ({ label }))} />
        </Block>

        <Block id="questions" title="Interview questions" lead="Sixteen questions analysts are commonly asked. Answer each in your head or aloud before you reveal what a good answer covers.">
          <QuestionBank questions={interviewQuestions} />
        </Block>

        <Block id="mock" title="Mock interview" lead="Practise under light time pressure. This is self-assessed: you compare your answer with the key points and rate yourself.">
          <MockInterview questions={interviewQuestions} />
        </Block>

        <Block id="sql" title="SQL interview practice" lead={`The ${sqlSet.length} medium and hard questions from the SQL path, the level most interviews test. Each opens in its lesson with hints and a model solution.`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {sqlSet.map((q) => (
              <li key={q.href + q.title}>
                <Link
                  href={q.href}
                  className="flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{q.topic}</span>
                    <span className="block font-medium">{q.title}</span>
                  </span>
                  <Badge variant={difficultyVariant(q.difficulty)}>{q.difficulty}</Badge>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            These lesson questions are compared against a model solution. To have your query run and checked automatically, use the{" "}
            <Link href="/practice/sql" className="font-medium text-primary underline-offset-4 hover:underline">
              SQL practice challenges
            </Link>
            .
          </p>
        </Block>

        <Block id="cases" title="Business case studies" lead="Case questions test how you think, not whether you reach one right answer. Read the prompt, plan your approach, then compare.">
          <div className="space-y-5">
            {caseStudies.map((c, i) => (
              <Card key={c.title} className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Case {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 leading-relaxed">{c.prompt}</p>
                <div className="mt-4">
                  <Reveal label="a model approach">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border bg-surface p-4">
                        <h4 className="text-sm font-semibold">Questions to ask first</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                          {c.clarify.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-border bg-surface p-4">
                        <h4 className="text-sm font-semibold">How to structure the analysis</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                          {c.approach.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-4 rounded-lg border border-success/30 bg-success/5 p-4 text-sm leading-relaxed">{c.answer}</p>
                  </Reveal>
                </div>
              </Card>
            ))}
          </div>
        </Block>

        <Block
          id="roles"
          title="Job descriptions and skill requirements"
          lead="Three composite profiles based on what analyst postings typically ask for. They are not real listings. Use them to see which roadmap stages each level expects."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {roleProfiles.map((r) => (
              <Card key={r.title} className="flex flex-col p-6">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-primary">{r.experience}</p>
                {[
                  { h: "Responsibilities", list: r.responsibilities },
                  { h: "Required skills", list: r.required },
                  { h: "Nice to have", list: r.bonus },
                ].map((g) => (
                  <div key={g.h} className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{g.h}</h4>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                      {g.list.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex-1" />
                <p className="mt-5 rounded-lg border border-border bg-surface p-3 text-sm">
                  <span className="font-medium">Prepare with: </span>
                  <Link href="/roadmap" className="text-primary underline-offset-4 hover:underline">
                    {r.stages}
                  </Link>
                </p>
              </Card>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
