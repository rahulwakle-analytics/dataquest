import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectProgress } from "@/components/project-progress";
import { ProjectTaskItem } from "@/components/project-task";
import { datasets } from "@/content/datasets";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Real-world data analytics project briefs with step-by-step tasks, hints, expected outputs, solutions and downloadable datasets: retail sales, HR attrition, e-commerce, customer segmentation and inventory.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="container py-14 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Project library</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Practical projects for your portfolio</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Five briefs built around real business problems, each with step-by-step tasks, a hint and a worked solution for every task, and a real dataset to download.
        </p>
      </header>
      <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
        Tick a task off as you complete it — progress is saved in this browser, separately from your lesson and practice progress.
      </p>

      <div className="mx-auto mt-12 max-w-4xl space-y-6">
        {projects.map((p) => {
          const dataset = datasets.find((d) => d.slug === p.datasetSlug);
          return (
            <Card key={p.slug} id={p.slug} className="scroll-mt-24 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {p.tools.map((t) => (
                    <Badge key={t} variant="primary">
                      {t}
                    </Badge>
                  ))}
                </div>
                {dataset && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/datasets/${dataset.slug}`}>
                      <Download /> Download dataset
                    </Link>
                  </Button>
                )}
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
              <ProjectProgress slug={p.slug} taskCount={p.tasks.length} />
              <ul className="mt-3 space-y-2.5">
                {p.tasks.map((t, i) => (
                  <ProjectTaskItem key={i} id={`project-${p.slug}-task-${i}`} index={i} task={t} />
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Portfolio deliverables</h3>
              <p className="mt-1.5 text-sm text-muted">What a finished run of this project leaves you with, ready to show a reviewer or put in a portfolio.</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {p.portfolioDeliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
