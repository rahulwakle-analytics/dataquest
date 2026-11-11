import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScenarioExplorer } from "@/components/career/scenario-explorer";
import { Block, PageHeader, SectionNav } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  applications,
  branches,
  dayInTheLife,
  deliverables,
  industries,
  progression,
  responsibilities,
  roleTypes,
  salaries,
  scenarios,
  softSkills,
  technicalSkills,
} from "@/content/career";

export const metadata: Metadata = {
  title: "Explore Data Analytics: what a data analyst does",
  description:
    "What data analytics is, what a data analyst does every day, the skills employers ask for, analyst role types, career progression and salary ranges.",
  alternates: { canonical: "/explore" },
};

const nav = [
  { href: "#what", label: "What it is" },
  { href: "#day", label: "A typical day" },
  { href: "#responsibilities", label: "Responsibilities" },
  { href: "#scenarios", label: "Workplace scenarios" },
  { href: "#applications", label: "Where it is used" },
  { href: "#roles", label: "Role types" },
  { href: "#skills", label: "Skills" },
  { href: "#progression", label: "Career path" },
  { href: "#salary", label: "Salary" },
];

export default function ExplorePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Explore data analytics"
        title="What a data analyst actually does"
        lead="Before you learn a single tool, understand the job: the questions analysts answer, how they answer them, and where the career leads."
      />
      <SectionNav label="On this page" links={nav} />

      <div className="mx-auto mt-10 max-w-5xl">
        <Block id="what" title="What is data analytics?">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 text-[17px] leading-relaxed">
              <p>
                Data analytics is the work of turning raw records into decisions. Every sale, sign-up, delivery and support ticket leaves a row in a database. On their own those rows say nothing. Analytics is how a business finds out what they mean.
              </p>
              <p>
                It usually answers one of four kinds of question: what happened, why it happened, what is likely to happen next, and what we should do about it. Most analyst work is the first two.
              </p>
            </div>
            <Card className="p-6">
              <h3 className="font-semibold">Who is a data analyst?</h3>
              <p className="mt-2 leading-relaxed text-muted">
                A data analyst is the person a team turns to when they need to know something. A shop manager asks why sales fell. An analyst finds the data, checks it, works out the answer and explains it in terms the manager can act on.
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                The job is part detective, part translator. You do not need to be a programmer or a mathematician to start. You need to be curious, careful and clear.
              </p>
            </Card>
          </div>
        </Block>

        <Block id="day" title="What does a data analyst do every day?" lead="No two days match, but this is a realistic one for an analyst supporting a sales and marketing team.">
          <ol className="relative space-y-4 border-l border-border pl-6">
            {dayInTheLife.map((d) => (
              <li key={d.time} className="relative">
                <span aria-hidden="true" className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-mono text-sm text-primary">{d.time}</p>
                <h3 className="font-semibold">{d.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">{d.body}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block id="responsibilities" title="Responsibilities and deliverables">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {responsibilities.map((r) => (
              <Card key={r.title} className="p-5">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
              </Card>
            ))}
          </div>
          <h3 className="mt-8 font-semibold">What an analyst hands over</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </Block>

        <Block
          id="scenarios"
          title="See the job in action"
          lead="Four requests an analyst might receive. Step through each one from the business problem to the recommendation. The findings are illustrative examples, written to show how the reasoning works."
        >
          <ScenarioExplorer scenarios={scenarios} />
        </Block>

        <Block id="applications" title="Real-world business applications" lead="Almost every department has questions that data can answer.">
          <div className="grid gap-3 sm:grid-cols-2">
            {applications.map((a) => (
              <div key={a.area} className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-primary">{a.area}</h3>
                <p className="mt-1 text-sm leading-relaxed">{a.example}</p>
              </div>
            ))}
          </div>
          <h3 id="industries" className="mt-8 scroll-mt-24 font-semibold">
            Industries that hire analysts
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm">
                {i}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="roles" title="Different types of analyst roles" lead="Job titles vary between companies, but most analyst roles are one of these.">
          <div tabIndex={0} role="region" aria-label="Analyst role types" className="overflow-x-auto rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Role</th>
                  <th scope="col" className="px-4 py-3 font-medium">Focus</th>
                  <th scope="col" className="px-4 py-3 font-medium">Typical tools</th>
                </tr>
              </thead>
              <tbody>
                {roleTypes.map((r) => (
                  <tr key={r.role} className="border-t border-border bg-card">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold">{r.role}</th>
                    <td className="px-4 py-3 leading-relaxed text-muted">{r.focus}</td>
                    <td className="px-4 py-3 text-muted">{r.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block id="skills" title="Skills employers ask for">
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { title: "Technical skills", list: technicalSkills },
              { title: "Soft skills", list: softSkills },
            ].map((group) => (
              <Card key={group.title} className="p-6">
                <h3 className="font-semibold">{group.title}</h3>
                <dl className="mt-4 space-y-4">
                  {group.list.map((s) => (
                    <div key={s.skill}>
                      <dt className="text-sm font-semibold">{s.skill}</dt>
                      <dd className="mt-0.5 text-sm leading-relaxed text-muted">{s.why}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>
        </Block>

        <Block id="progression" title="Career progression" lead="Titles and timings differ by company. This is a common shape.">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {progression.map((p, i) => (
              <li key={p.level}>
                <Card className="h-full p-5">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{i + 1}</span>
                  <h3 className="mt-3 font-semibold">{p.level}</h3>
                  <p className="text-sm text-primary">{p.years}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </Card>
              </li>
            ))}
          </ol>
          <h3 className="mt-8 font-semibold">Where analysts go next</h3>
          <ul className="mt-3 space-y-2 text-muted">
            {branches.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </Block>

        <Block
          id="salary"
          title="Salary expectations"
          lead={`Annual pay from published salary guides, checked in ${salaries.checked}. Treat these as rough bands: sources disagree by a wide margin, and pay depends heavily on city, industry and company.`}
        >
          <div tabIndex={0} role="region" aria-label="Salary ranges by country" className="overflow-x-auto rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Country</th>
                  <th scope="col" className="px-4 py-3 font-medium">Entry level</th>
                  <th scope="col" className="px-4 py-3 font-medium">Mid level</th>
                  <th scope="col" className="px-4 py-3 font-medium">Senior</th>
                  <th scope="col" className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {salaries.rows.map((r) => (
                  <tr key={r.country} className="border-t border-border bg-card align-top">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold">{r.country}</th>
                    <td className="px-4 py-3 tabular-nums">{r.entry}</td>
                    <td className="px-4 py-3 tabular-nums">{r.mid}</td>
                    <td className="px-4 py-3 tabular-nums">{r.senior}</td>
                    <td className="px-4 py-3 text-muted">
                      <a href={r.source.href} target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                        {r.source.label}
                      </a>
                      <span className="mt-1 block text-xs leading-relaxed">{r.note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            Each row comes from a single source and the three sources define experience levels differently, so the rows are not directly comparable. Check current local listings before you negotiate.
          </p>
        </Block>

        <div className="mt-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-violet/15 p-8 text-center sm:p-12">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">Ready to start? Follow the roadmap.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Nine stages take you from the fundamentals to job-ready, with progress tracked as you go.</p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/roadmap">
              Open the career roadmap <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
