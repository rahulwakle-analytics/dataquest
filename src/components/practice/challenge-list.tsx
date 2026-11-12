"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bookmark, CheckCircle2, ChevronRight, Circle, History, Search, Shuffle, Sparkles, Zap } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { dailyIndex, isBookmarked, recentChallengeIds, toggleBookmark, useChallengeMeta } from "@/lib/challenge-meta";
import { isSolved, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard";
type Item = { slug: string; title: string; difficulty: Difficulty; topics: string[] };

type Props = {
  challenges: Item[];
  /** Route prefix for each challenge, e.g. "/practice/sql" or "/practice/excel". */
  basePath: string;
  /** Progress-store id prefix, e.g. "practice-sql" or "practice-excel". */
  idPrefix: string;
  xp: Record<Difficulty, number>;
  progressLabel: string;
};

type SolvedFilter = "all" | "solved" | "unsolved" | "bookmarked";

export function ChallengeList({ challenges, basePath, idPrefix, xp, progressLabel }: Props) {
  const progress = useProgress();
  const meta = useChallengeMeta();
  const router = useRouter();
  const challengeId = (slug: string) => `${idPrefix}/${slug}`;
  const solved = challenges.filter((c) => isSolved(progress, challengeId(c.slug), 0));
  const earned = solved.reduce((n, c) => n + xp[c.difficulty], 0);
  const total = challenges.reduce((n, c) => n + xp[c.difficulty], 0);

  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("All topics");
  const [status, setStatus] = useState<SolvedFilter>("all");

  const topics = useMemo(() => ["All topics", ...Array.from(new Set(challenges.flatMap((c) => c.topics))).sort()], [challenges]);

  const matches = (c: Item) => {
    if (topic !== "All topics" && !c.topics.includes(topic)) return false;
    if (query && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))) return false;
    const done = isSolved(progress, challengeId(c.slug), 0);
    if (status === "solved" && !done) return false;
    if (status === "unsolved" && done) return false;
    if (status === "bookmarked" && !isBookmarked(meta, challengeId(c.slug))) return false;
    return true;
  };
  const filtered = challenges.filter(matches);

  const dailySlug = challenges[dailyIndex(challenges.length)]?.slug;
  const daily = challenges.find((c) => c.slug === dailySlug);
  const recent = recentChallengeIds(meta, 5)
    .filter((id) => id.startsWith(idPrefix + "/"))
    .map((id) => id.slice(idPrefix.length + 1))
    .map((slug) => challenges.find((c) => c.slug === slug))
    .filter((c): c is Item => Boolean(c));

  const pickRandom = () => {
    const pool = filtered.length ? filtered : challenges;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`${basePath}/${pick.slug}`);
  };

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium">
            {solved.length} of {challenges.length} challenges solved
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Zap className="size-4 text-primary" aria-hidden="true" /> {earned} of {total} XP
          </span>
        </div>
        <Progress value={(solved.length / challenges.length) * 100} label={progressLabel} />
        <p className="mt-3 text-xs text-muted">XP is counted once per challenge, only when your answer passes its test cases. Saved in this browser.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {daily && (
          <Link href={`${basePath}/${daily.slug}`} className="group flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Sparkles className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium uppercase tracking-wide text-primary">Challenge of the day</span>
              <span className="block truncate font-medium">{daily.title}</span>
            </span>
            <Badge variant={difficultyVariant(daily.difficulty)}>{daily.difficulty}</Badge>
          </Link>
        )}
        <Button variant="secondary" onClick={pickRandom} className="h-full justify-center">
          <Shuffle className="size-4" /> Random challenge
        </Button>
      </div>

      {recent.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <History className="size-3.5" /> Recently viewed
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((c) => (
              <Link key={c.slug} href={`${basePath}/${c.slug}`} className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-primary hover:text-foreground">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges or topics…"
            aria-label="Search challenges"
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="Filter by topic"
          className="rounded-md border border-border bg-surface px-2.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="flex gap-1 rounded-md border border-border bg-surface p-1 text-xs">
          {(["all", "solved", "unsolved", "bookmarked"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={cn("rounded px-2 py-1 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", status === s ? "bg-primary-strong text-white" : "text-muted hover:text-foreground")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">No challenges match these filters.</p>
      ) : (
        (["Easy", "Medium", "Hard"] as const).map((d) => {
          const inLevel = filtered.filter((c) => c.difficulty === d);
          if (inLevel.length === 0) return null;
          return (
            <section key={d} className="mt-8" aria-labelledby={`level-${d}`}>
              <h2 id={`level-${d}`} className="mb-3 text-xl font-semibold tracking-tight">
                {d}
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {inLevel.map((c) => {
                  const id = challengeId(c.slug);
                  const done = isSolved(progress, id, 0);
                  const marked = isBookmarked(meta, id);
                  return (
                    <li key={c.slug} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(id)}
                        aria-pressed={marked}
                        aria-label={marked ? `Remove ${c.title} from bookmarks` : `Bookmark ${c.title}`}
                        className="shrink-0 p-4 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Bookmark className={cn("size-4", marked && "fill-primary text-primary")} />
                      </button>
                      <Link href={`${basePath}/${c.slug}`} className="flex min-w-0 flex-1 items-center gap-4 py-4 pr-5 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                        {done ? <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Solved" /> : <Circle className="size-5 shrink-0 text-muted" aria-label="Not solved" />}
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{c.title}</span>
                          <span className="block truncate text-sm text-muted">{c.topics.join(" · ")}</span>
                        </span>
                        <Badge variant={difficultyVariant(c.difficulty)} className="hidden sm:inline-flex">
                          {xp[c.difficulty]} XP
                        </Badge>
                        <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
