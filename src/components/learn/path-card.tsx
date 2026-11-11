"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ToolIcon } from "@/components/tool-icon";
import { isComplete, useProgress } from "@/lib/progress";

export type PathCardData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  difficulty: string;
  topics: number;
  lessonIds: string[];
  firstHref: string;
};

export function PathCard({ path }: { path: PathCardData }) {
  const progress = useProgress();
  const done = path.lessonIds.filter((id) => isComplete(progress, id)).length;
  const total = path.lessonIds.length;
  const planned = path.topics - total;
  const pct = total ? (done / total) * 100 : 0;
  const nextId = path.lessonIds.find((id) => !isComplete(progress, id));
  const href = nextId ? `/paths/${nextId}` : path.firstHref;

  return (
    <Card className="group flex flex-col p-6 transition-colors duration-200 hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <ToolIcon tool={path.slug} />
        <Badge>{path.difficulty}</Badge>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">
        <Link href={`/paths/${path.slug}`} className="hover:text-primary">
          {path.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm font-medium text-primary">{path.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{path.description}</p>

      <dl className="mt-5 flex gap-6 text-sm">
        <div>
          <dt className="text-muted">Lessons</dt>
          <dd className="font-semibold">{total}</dd>
        </div>
        <div>
          <dt className="text-muted">Planned next</dt>
          <dd className="font-semibold">{planned > 0 ? `${planned} topics` : "Complete"}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>Your progress</span>
          <span>
            {done} of {total} lessons
          </span>
        </div>
        <Progress value={pct} label={`${path.name} progress`} />
      </div>

      <Button asChild className="mt-6 w-full">
        <Link href={href}>
          {done > 0 ? "Continue learning" : "Start learning"} <ArrowRight />
        </Link>
      </Button>
    </Card>
  );
}
