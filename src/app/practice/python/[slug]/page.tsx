import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PythonWorkspace } from "@/components/practice/python-workspace";
import { pythonChallenges } from "@/content/python-challenges";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return pythonChallenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = pythonChallenges.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.title}: Python challenge (${c.difficulty})`, description: c.task, alternates: { canonical: `/practice/python/${c.slug}` } };
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params;
  const i = pythonChallenges.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const next = pythonChallenges[i + 1];
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/practice/python" className="hover:text-foreground">
          Python practice
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">{pythonChallenges[i].title}</span>
      </nav>
      <PythonWorkspace key={slug} challenge={pythonChallenges[i]} next={next && { slug: next.slug, title: next.title }} />
    </div>
  );
}
