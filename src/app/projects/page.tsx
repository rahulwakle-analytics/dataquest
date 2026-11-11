import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Real-world data analytics project briefs: retail sales, HR attrition, e-commerce, customer segmentation and inventory.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="container py-14 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Project library</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Practical projects for your portfolio</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Five briefs built around real business problems. You can work through them today with your own tools.
        </p>
      </header>
      <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
        Sample data for these briefs is in the{" "}
        <Link href="/datasets" className="font-medium text-primary underline-offset-4 hover:underline">
          dataset library
        </Link>
        . Per-task hints, solution walkthroughs and completion tracking are in development.
      </p>

      <div className="mx-auto mt-12 max-w-4xl space-y-6">
        {projects.map((p) => (
          <Card key={p.slug} id={p.slug} className="scroll-mt-24 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {p.tools.map((t) => (
                <Badge key={t} variant="primary">
                  {t}
                </Badge>
              ))}
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{p.title}</h2>
            <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">Business problem</h3>
            <p className="mt-1.5 leading-relaxed">{p.problem}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Objectives</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                  {p.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Deliverables</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                  {p.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">Dataset</h3>
                <p className="mt-2 text-sm">{p.dataset}</p>
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Step-by-step tasks</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
              {p.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>
  );
}
