"use client";

import { python } from "@codemirror/lang-python";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type Props = { value: string; onChange: (v: string) => void; onRun: () => void };

export default function PythonEditor({ value, onChange, onRun }: Props) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(
    () => [
      python(),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ "aria-label": "Python editor" }),
      Prec.highest(keymap.of([{ key: "Mod-Enter", run: () => (onRun(), true) }])),
    ],
    [onRun],
  );
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      height="260px"
      basicSetup={{ foldGutter: false, highlightActiveLine: false }}
      className="overflow-hidden rounded-lg border border-border text-[13px] [&_.cm-editor]:bg-surface [&_.cm-gutters]:bg-surface [&_.cm-focused]:outline-none"
    />
  );
}
