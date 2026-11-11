"use client";

import { useSyncExternalStore } from "react";

/**
 * Self-tracked checklist items (roadmap stages, career checklists). Saved in this
 * browser's localStorage, separately from validated lesson progress.
 */
const KEY = "dq:checklist:v1";
export type ChecklistState = Record<string, true>;

const EMPTY: ChecklistState = {};
let cache: ChecklistState | null = null;
const listeners = new Set<() => void>();

function read(): ChecklistState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as ChecklistState) : {};
  } catch {
    cache = {};
  }
  return cache;
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

export function useChecklist(): ChecklistState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleItem(id: string) {
  const next = { ...read() };
  if (next[id]) delete next[id];
  else next[id] = true;
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep it in memory for this visit */
  }
  listeners.forEach((l) => l());
}
