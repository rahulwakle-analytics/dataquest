import { highlight } from "@/lib/highlight";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

const cls = {
  kw: "text-primary font-medium",
  str: "text-success",
  num: "text-warning",
  com: "text-muted italic",
  fn: "text-violet",
  plain: "",
} as const;

export function CodeBlock({ code, lang, className }: { code: string; lang: string; className?: string }) {
  const tokens = highlight(code, lang);
  return (
    <div className={cn("relative rounded-xl border border-border bg-surface", className)}>
      <CopyButton text={code} />
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed" tabIndex={0}>
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={cls[t.kind]}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
