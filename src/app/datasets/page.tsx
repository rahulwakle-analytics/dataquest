import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { datasetRows, datasets } from "@/content/datasets";

export const metadata: Metadata = {
  title: "Dataset Library: free CSV datasets for data analysis practice",
  description: "Eight downloadable sample datasets for practising Excel, SQL, Power BI and Python: retail sales, e-commerce, HR, marketing, finance, inventory and more.",
  alternates: { canonical: "/datasets" },
};

export default function DatasetsPage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Dataset library"
        title="Data to practise on"
        lead="Eight sample datasets you can download as CSV and open in Excel, load into a database, or read with Python."
      />
      <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
        These are synthetic datasets generated for practice. The companies and people in them are not real, but the relationships between columns behave as they do in real business data.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {datasets.map((d) => (
          <Link key={d.slug} href={`/datasets/${d.slug}`} className="group focus-visible:outline-none">
            <Card className="flex h-full flex-col p-6 transition-colors duration-200 group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Database className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{d.name}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{d.summary}</p>
              <p className="mt-4 text-sm text-muted">
                {d.files.length} {d.files.length === 1 ? "file" : "files"} · {datasetRows(d).toLocaleString("en-US")} rows
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View and download <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
