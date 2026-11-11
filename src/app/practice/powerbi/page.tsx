import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PowerBiExerciseCard } from "@/components/practice/powerbi-exercise";
import { PowerBiSummary } from "@/components/practice/powerbi-summary";
import { challengeId, powerbiExercises, type Category } from "@/content/powerbi-practice";

export const metadata: Metadata = {
  title: "Power BI Practice Lab: modelling, DAX and dashboard exercises",
  description: "Guided Power BI exercises on data modelling, relationships, DAX, measures vs. calculated columns, KPI calculations, dashboard design and report interpretation. Simulated practice, not a Power BI Desktop replica.",
  alternates: { canonical: "/practice/powerbi" },
};

const categories: Category[] = ["Data Modelling", "Relationships", "DAX", "Measures vs Columns", "KPI Calculation", "Dashboard Design", "Report Interpretation"];

export default function PowerBiPracticePage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Power BI practice"
        title="Think like a report builder."
        lead="Guided scenarios on modelling, DAX, measures and dashboards. Each one is auto-checked — against a worked calculation where the question has a number, and against the right modelling choice where it doesn't."
      />
      <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm leading-relaxed">
        <p className="flex items-start gap-2 font-medium text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> This is simulated practice, not Power BI itself.
        </p>
        <p className="mt-1.5 pl-6 text-muted">
          Nothing here runs Power BI Desktop or executes live DAX. These are modelling, DAX and dashboard-design scenarios with one correct answer, checked the moment you pick it — a way to practise the
          thinking, not a substitute for building reports in the real tool.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <PowerBiSummary />
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-12">
        {categories.map((cat) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <h2 id={`cat-${cat}`} className="mb-4 text-xl font-semibold tracking-tight">
              {cat}
            </h2>
            <div className="space-y-5">
              {powerbiExercises
                .filter((e) => e.category === cat)
                .map((e) => (
                  <PowerBiExerciseCard key={challengeId(e.slug)} exercise={e} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
