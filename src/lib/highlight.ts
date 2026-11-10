export type Token = { text: string; kind: "kw" | "str" | "num" | "com" | "fn" | "plain" };

const SQL_KW =
  "select|from|where|group|by|order|having|limit|offset|distinct|as|and|or|not|in|is|null|like|ilike|between|join|inner|left|right|full|outer|cross|on|using|case|when|then|else|end|with|over|partition|rows|range|preceding|following|unbounded|current|row|asc|desc|union|all|exists|interval|true|false|filter|nulls|first|last|explain|analyze|create|index";
const PY_KW =
  "import|from|as|def|return|for|in|if|elif|else|while|and|or|not|True|False|None|lambda|with|print|class";

/** Small, dependency-free highlighter for lesson snippets. Monaco arrives with the practice engine. */
export function highlight(code: string, lang: string): Token[] {
  const kw = lang === "sql" ? SQL_KW : lang === "python" ? PY_KW : "";
  const comment = lang === "python" ? "#[^\\n]*" : "--[^\\n]*";
  const parts = [`(?<com>${comment})`, `(?<str>'(?:[^']|'')*'|"(?:[^"\\\\]|\\\\.)*")`, `(?<num>\\b\\d+(?:\\.\\d+)?\\b)`];
  if (kw) parts.push(`(?<kw>\\b(?:${kw})\\b)`);
  parts.push(`(?<fn>\\b[A-Za-z_][A-Za-z0-9_.]*(?=\\())`);
  const re = new RegExp(parts.join("|"), lang === "sql" ? "gi" : "g");
  const out: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: code.slice(last, i), kind: "plain" });
    const g = m.groups ?? {};
    const kind = g.com ? "com" : g.str ? "str" : g.num ? "num" : g.kw ? "kw" : "fn";
    out.push({ text: m[0], kind });
    last = i + m[0].length;
  }
  if (last < code.length) out.push({ text: code.slice(last), kind: "plain" });
  return out;
}
