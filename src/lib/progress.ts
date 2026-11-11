"use client";

import { useSyncExternalStore } from "react";

/**
 * Phase 1 progress store. Progress is saved in this browser's localStorage and
 * only ever written after a knowledge check has been validated. Phase 2 swaps
 * this module's read/write for Supabase without changing its callers.
 */
const KEY = "dq:progress:v1";

export type TopicProgress = {
  checks: Record<number, boolean>;
  completedAt?: string;
  /** Practice exercises that passed validation: exercise index → time first solved. */
  exercises?: Record<number, string>;
};
export type ProgressState = Record<string, TopicProgress>;

const EMPTY: ProgressState = {};
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as ProgressState) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep progress in memory for this visit */
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

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Record a validated knowledge-check result. A topic completes when every check is correct. */
export function recordCheck(topicId: string, index: number, correct: boolean, total: number) {
  const state = read();
  const prev = state[topicId] ?? { checks: {} };
  const checks = { ...prev.checks, [index]: prev.checks[index] || correct };
  const allCorrect = Array.from({ length: total }, (_, i) => checks[i]).every(Boolean);
  write({
    ...state,
    [topicId]: { ...prev, checks, completedAt: prev.completedAt ?? (allCorrect ? new Date().toISOString() : undefined) },
  });
}

/** Record a practice exercise that passed its test cases. Only the first solve is stored. */
export function recordExercise(topicId: string, index: number) {
  const state = read();
  const prev = state[topicId] ?? { checks: {} };
  if (prev.exercises?.[index]) return;
  write({ ...state, [topicId]: { ...prev, exercises: { ...prev.exercises, [index]: new Date().toISOString() } } });
}

export function isSolved(state: ProgressState, topicId: string, index: number) {
  return Boolean(state[topicId]?.exercises?.[index]);
}

export function resetProgress() {
  write({});
}

export function isComplete(state: ProgressState, topicId: string) {
  return Boolean(state[topicId]?.completedAt);
}
