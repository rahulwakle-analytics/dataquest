"use client";

import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type Props = { value: string; onChange: (v: string) => void; onRun: () => void; schema: Record<string, string[]>; height?: string };

export default function SqlEditor({ value, onChange, onRun, schema, height = "260px" }: Props) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(
    () => [
      sql({ dialect: PostgreSQL, schema, upperCaseKeywords: true }),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ "aria-label": "SQL editor" }),
      Prec.highest(keymap.of([{ key: "Mod-Enter", run: () => (onRun(), true) }])),
    ],
    [schema, onRun],
  );
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      height={height}
      basicSetup={{ foldGutter: false, highlightActiveLine: false }}
      className="overflow-hidden rounded-lg border border-border text-[13px] [&_.cm-editor]:bg-surface [&_.cm-gutters]:bg-surface [&_.cm-focused]:outline-none"
    />
  );
}
