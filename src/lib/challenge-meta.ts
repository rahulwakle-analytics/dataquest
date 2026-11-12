"use client";

import { useSyncExternalStore } from "react";

/**
 * Bookmark and view-history store for the challenge library (SQL today; Excel and Power BI
 * reuse the same module). Saved in this browser's localStorage, independent of solved-progress
 * (lib/progress.ts) since a challenge can be bookmarked or recently viewed without being solved.
 */
const KEY = "dq:challenge-meta:v1";

export type ChallengeMeta = {
  bookmarks: Record<string, true>;
  /** Challenge id -> ISO timestamp of the most recent visit. */
  history: Record<string, string>;
};

const EMPTY: ChallengeMeta = { bookmarks: {}, history: {} };
let cache: ChallengeMeta | null = null;
const listeners = new Set<() => void>();

function read(): ChallengeMeta {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as ChallengeMeta) } : { bookmarks: {}, history: {} };
  } catch {
    cache = { bookmarks: {}, history: {} };
  }
  return cache;
}

function write(next: ChallengeMeta) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep in memory for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useChallengeMeta(): ChallengeMeta {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleBookmark(id: string) {
  const state = read();
  const bookmarks = { ...state.bookmarks };
  if (bookmarks[id]) delete bookmarks[id];
  else bookmarks[id] = true;
  write({ ...state, bookmarks });
}

export function isBookmarked(state: ChallengeMeta, id: string) {
  return Boolean(state.bookmarks[id]);
}

/** Called when a challenge's detail page is viewed, so "recently viewed" can be shown on the list. */
export function recordView(id: string) {
  const state = read();
  write({ ...state, history: { ...state.history, [id]: new Date().toISOString() } });
}

export function recentChallengeIds(state: ChallengeMeta, limit = 5): string[] {
  return Object.entries(state.history)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, limit)
    .map(([id]) => id);
}

/**
 * A deterministic "challenge of the day": the same index for every visitor on a given calendar
 * day, derived from today's date and the list length, with no server or random seed involved.
 */
export function dailyIndex(length: number, date = new Date()): number {
  if (length <= 0) return 0;
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % length;
}
