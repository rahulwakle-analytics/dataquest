import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { datasetRows, datasets, fileInfo } from "@/content/datasets";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return datasets.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = datasets.find((x) => x.slug === slug);
  if (!d) return {};
  return { title: `${d.name} dataset (CSV download)`, description: d.summary + " " + d.useCase, alternates: { canonical: `/datasets/${d.slug}` } };
}

export default async function DatasetPage({ params }: Props) {
  const { slug } = await params;
  const d = datasets.find((x) => x.slug === slug);
  if (!d) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${d.name} (DataQuest sample dataset)`,
    description: d.description,
    isAccessibleForFree: true,
    distribution: d.files.map((f) => ({ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `/datasets/${f.file}` })),
  };

  return (
    <div className="container py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/datasets" className="hover:text-foreground">
          Datasets
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">{d.name}</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{d.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{d.description}</p>
        <p className="mt-3 text-sm text-muted">
          {d.files.length} {d.files.length === 1 ? "file" : "files"} · {datasetRows(d).toLocaleString("en-US")} rows in total · synthetic sample data
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-semibold">Business use case</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{d.useCase}</p>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Related exercises</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {d.exercises.map((e) => (
              <li key={e.href + e.label}>
                <Link href={e.href} className="text-primary underline-offset-4 hover:underline">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Suggested projects</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {d.projects.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="text-primary underline-offset-4 hover:underline">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-10 space-y-10">
        {d.files.map((f) => {
          const info = fileInfo(f.file);
          return (
            <section key={f.file} aria-labelledby={`file-${f.label}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id={`file-${f.label}`} className="font-mono text-xl font-semibold">
                    {f.label}
                  </h2>
                  <p className="text-sm text-muted">
                    {info.rows.toLocaleString("en-US")} rows · {info.columns.length} columns
                  </p>
                </div>
                <Button asChild>
                  <a href={`/datasets/${f.file}`} download={f.file}>
                    <Download /> Download {f.file}
                  </a>
                </Button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Columns in {f.label}</caption>
                    <thead className="bg-surface text-muted">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 font-medium">Column</th>
                        <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {info.columns.map((c) => (
                        <tr key={c} className="border-t border-border bg-card align-top">
                          <th scope="row" className="whitespace-nowrap px-4 py-2 font-mono text-[13px] font-medium">{c}</th>
                          <td className="px-4 py-2 leading-relaxed text-muted">{f.columns[c]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="min-w-0">
                  <div tabIndex={0} role="region" aria-label={`First rows of ${f.label}`} className="overflow-x-auto rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <table className="w-full text-left font-mono text-[12.5px]">
                      <caption className="sr-only">First rows of {f.label}</caption>
                      <thead className="bg-surface text-muted">
                        <tr>
                          {info.columns.map((c) => (
                            <th key={c} scope="col" className="whitespace-nowrap px-3 py-2.5 font-medium">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {info.preview.map((row, i) => (
                          <tr key={i} className="border-t border-border bg-card">
                            {info.columns.map((c) => (
                              <td key={c} className="whitespace-nowrap px-3 py-2">{row[c] === null || row[c] === "" ? "" : String(row[c])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-muted">First {info.preview.length} rows.</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
