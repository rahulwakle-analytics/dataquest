"use client";

import Link from "next/link";
import { toggleItem, useChecklist } from "@/lib/checklist";
import { cn } from "@/lib/utils";

export type CheckItem = { label: string; href?: string };

/** A tick list the learner marks off themselves. Not validated; saved in this browser. */
export function Checklist({ group, items, className }: { group: string; items: CheckItem[]; className?: string }) {
  const state = useChecklist();
  const done = items.filter((_, i) => state[`${group}:${i}`]).length;
  return (
    <div className={className}>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {items.map((item, i) => {
          const id = `${group}:${i}`;
          const checked = Boolean(state[id]);
          return (
            <li key={id} className="flex items-start gap-3 px-4 py-3">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(id)}
                className="mt-1 size-4 shrink-0 accent-[rgb(var(--primary-strong))]"
              />
              <div className="min-w-0 text-sm leading-relaxed">
                <label htmlFor={id} className={cn("cursor-pointer", checked && "text-muted line-through")}>
                  {item.label}
                </label>
                {item.href && (
                  <Link href={item.href} className="ml-2 whitespace-nowrap font-medium text-primary underline-offset-4 hover:underline">
                    Open<span className="sr-only">: {item.label}</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        {done} of {items.length} ticked. You mark these yourself; they are saved in this browser.
      </p>
    </div>
  );
}
