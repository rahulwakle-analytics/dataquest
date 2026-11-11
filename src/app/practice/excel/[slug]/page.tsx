import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SheetWorkspace } from "@/components/practice/sheet-workspace";
import { sheetChallenges } from "@/content/sheet-challenges";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return sheetChallenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = sheetChallenges.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.title}: Excel challenge (${c.difficulty})`, description: c.task, alternates: { canonical: `/practice/excel/${c.slug}` } };
}

export default async function SheetChallengePage({ params }: Props) {
  const { slug } = await params;
  const i = sheetChallenges.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const next = sheetChallenges[i + 1];
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/practice/excel" className="hover:text-foreground">
          Excel practice
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">{sheetChallenges[i].title}</span>
      </nav>
      <SheetWorkspace key={slug} challenge={sheetChallenges[i]} next={next && { slug: next.slug, title: next.title }} />
    </div>
  );
}
