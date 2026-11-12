import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SqlWorkspace, type TablePreview } from "@/components/practice/sql-workspace";
import generated from "@/content/datasets.generated.json";
import { sqlChallenges } from "@/content/sql-challenges";
import { DATABASES, TABLES_OF } from "@/lib/sql/databases";

type Props = { params: Promise<{ slug: string }> };
type Manifest = Record<string, { rows: number; columns: string[]; preview: Record<string, string | number | null>[] }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return sqlChallenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = sqlChallenges.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.title}: SQL challenge (${c.difficulty})`, description: c.task, alternates: { canonical: `/practice/sql/${c.slug}` } };
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params;
  const i = sqlChallenges.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const next = sqlChallenges[i + 1];
  const manifest = generated as Manifest;
  const database = sqlChallenges[i].database ?? "retail";
  const prefix = DATABASES[database].prefix;
  const tables: TablePreview[] = TABLES_OF(database).map((t) => ({ name: t, ...manifest[`${prefix}_${t}.csv`] }));
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/practice/sql" className="hover:text-foreground">
          SQL practice
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">{sqlChallenges[i].title}</span>
      </nav>
      <SqlWorkspace key={slug} challenge={sqlChallenges[i]} tables={tables} next={next && { slug: next.slug, title: next.title }} />
    </div>
  );
}
