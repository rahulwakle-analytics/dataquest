"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Circle, Dot, Search, Shuffle, X } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isBookmarked, toggleBookmark, useChallengeMeta } from "@/lib/challenge-meta";
import { isSolved, useProgress } from "@/lib/progress";
import type { CatalogItem, Tool } from "@/lib/practice-catalog";
import { TOOLS } from "@/lib/practice-catalog";
import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard";
type StatusFilter = "all" | "solved" | "attempted" | "not-attempted";
const PAGE_SIZE = 20;

export function UnifiedPracticeTable({ items }: { items: CatalogItem[] }) {
  const progress = useProgress();
  const meta = useChallengeMeta();

  const [query, setQuery] = useState("");
  const [tool, setTool] = useState<Tool | "All">("All");
  const [topic, setTopic] = useState("All topics");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const statusOf = (item: CatalogItem): "solved" | "attempted" | "not-attempted" => {
    if (isSolved(progress, item.id, 0)) return "solved";
    if (meta.history[item.id]) return "attempted";
    return "not-attempted";
  };

  const topicsForTool = useMemo(() => {
    const pool = tool === "All" ? items : items.filter((i) => i.tool === tool);
    return ["All topics", ...Array.from(new Set(pool.flatMap((i) => i.topics))).sort()];
  }, [items, tool]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (tool !== "All" && i.tool !== tool) return false;
      if (topic !== "All topics" && !i.topics.includes(topic)) return false;
      if (difficulty !== "All" && i.difficulty !== difficulty) return false;
      if (status !== "all" && statusOf(i) !== status) return false;
      if (query && !i.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [items, tool, topic, difficulty, status, query, progress, meta]);

  const solvedCount = items.filter((i) => isSolved(progress, i.id, 0)).length;
  const totalXp = items.reduce((n, i) => n + i.xp, 0);
  const earnedXp = items.filter((i) => isSolved(progress, i.id, 0)).reduce((n, i) => n + i.xp, 0);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const shown = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const clearFilters = () => {
    setQuery("");
    setTool("All");
    setTopic("All topics");
    setDifficulty("All");
    setStatus("all");
    setPage(1);
  };
  const hasFilters = query !== "" || tool !== "All" || topic !== "All topics" || difficulty !== "All" || status !== "all";

  const randomChallenge = () => {
    const pool = filtered.length > 0 ? filtered : items;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) window.location.href = pick.href;
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{solvedCount}</span> of {items.length} problems solved · {earnedXp} of {totalXp} XP
        </p>
        <Button variant="secondary" size="sm" onClick={randomChallenge}>
          <Shuffle /> Random problem
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search problems"
            aria-label="Search problems"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <select
          aria-label="Filter by tool"
          value={tool}
          onChange={(e) => {
            setTool(e.target.value as Tool | "All");
            setTopic("All topics");
            setPage(1);
          }}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="All">All tools</option>
          {TOOLS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setPage(1);
          }}
          className="max-w-[180px] rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {topicsForTool.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value as Difficulty | "All");
            setPage(1);
          }}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusFilter);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="all">All status</option>
          <option value="not-attempted">Not attempted</option>
          <option value="attempted">Attempted</option>
          <option value="solved">Solved</option>
        </select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X /> Clear filters
          </Button>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="w-10 px-3 py-2.5"></th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Problem
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Tool
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Topic
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Difficulty
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((item) => {
              const st = statusOf(item);
              const bookmarked = isBookmarked(meta, item.id);
              return (
                <tr key={item.id} className="border-t border-border hover:bg-surface/60">
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                      aria-pressed={bookmarked}
                      aria-label={bookmarked ? `Remove ${item.title} from bookmarks` : `Bookmark ${item.title}`}
                      className="text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Bookmark className={cn("size-4", bookmarked && "fill-primary text-primary")} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link href={item.href} className="font-medium underline-offset-4 hover:text-primary hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{item.tool}</td>
                  <td className="px-3 py-2.5 text-muted">
                    <span className="inline-flex flex-wrap gap-1">
                      {item.topics.slice(0, 2).map((t) => (
                        <span key={t} className="rounded border border-border bg-surface px-1.5 py-0.5 text-[11px]">
                          {t}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant={difficultyVariant(item.difficulty)}>{item.difficulty}</Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    {st === "solved" && (
                      <span className="inline-flex items-center gap-1.5 text-success">
                        <CheckCircle2 className="size-3.5" /> Solved
                      </span>
                    )}
                    {st === "attempted" && (
                      <span className="inline-flex items-center gap-1.5 text-muted">
                        <Dot className="size-5 -mx-1" /> Attempted
                      </span>
                    )}
                    {st === "not-attempted" && (
                      <span className="inline-flex items-center gap-1.5 text-muted">
                        <Circle className="size-3 opacity-40" /> Not attempted
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted">
                  No problems match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {pageSafe} of {pageCount} ({filtered.length} problems)
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={pageSafe <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={pageSafe >= pageCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
