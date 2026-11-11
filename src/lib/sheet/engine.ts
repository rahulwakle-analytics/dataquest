/**
 * DataQuest formula engine.
 *
 * A small spreadsheet calculation engine written for the practice exercises. It parses and
 * evaluates a subset of Excel's formula language: arithmetic, comparison, text joining,
 * A1 references (relative, absolute and mixed), ranges, structured table references and
 * the functions listed in FUNCTIONS below. It is not Excel and does not read workbooks.
 */

export type Raw = number | string | boolean | null;
export type Err = { error: string };
export type Scalar = Raw | Err;
type Rng = { range: Scalar[][] };
type Val = Scalar | Rng;

export type Fmt = "money" | "pct" | "int" | "num2";
export type TableDef = { name: string; ref: string };
export type SheetSpec = {
  /** rows[0] is spreadsheet row 1. A string starting with "=" is a formula. */
  rows: Raw[][];
  tables?: TableDef[];
  /** Display format by column letter, e.g. { C: "money" }. */
  formats?: Record<string, Fmt>;
};

export const isErr = (v: unknown): v is Err => typeof v === "object" && v !== null && "error" in v;
const isRng = (v: Val): v is Rng => typeof v === "object" && v !== null && "range" in v;
const E = (error: string): Err => ({ error });

/* ---------- addresses ---------- */

export function colToIndex(col: string) {
  let n = 0;
  for (const ch of col.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}
export function indexToCol(i: number) {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}
export function parseAddr(addr: string) {
  const m = /^\$?([A-Za-z]{1,2})\$?(\d+)$/.exec(addr.trim());
  if (!m) throw new Error(`Bad address: ${addr}`);
  return { c: colToIndex(m[1]), r: Number(m[2]) - 1 };
}
export const addrOf = (c: number, r: number) => `${indexToCol(c)}${r + 1}`;
export function parseRange(ref: string) {
  const [a, b] = ref.split(":");
  const p = parseAddr(a);
  const q = parseAddr(b ?? a);
  return { c0: Math.min(p.c, q.c), r0: Math.min(p.r, q.r), c1: Math.max(p.c, q.c), r1: Math.max(p.r, q.r) };
}
/** Addresses in a range, row by row. */
export function cellsIn(ref: string) {
  const { c0, r0, c1, r1 } = parseRange(ref);
  const out: { c: number; r: number; addr: string }[] = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push({ c, r, addr: addrOf(c, r) });
  return out;
}

/* ---------- tokenizer ---------- */

type Tok =
  | { t: "num"; v: number; s: number; e: number }
  | { t: "str"; v: string; s: number; e: number }
  | { t: "ref"; col: number; row: number; absCol: boolean; absRow: boolean; s: number; e: number }
  | { t: "sref"; table: string | null; thisRow: boolean; column: string; s: number; e: number }
  | { t: "id"; v: string; s: number; e: number }
  | { t: "err"; v: string; s: number; e: number }
  | { t: "op"; v: string; s: number; e: number };

export class FormulaError extends Error {}

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m: RegExpExecArray | null;
    if ((m = /^\s+/.exec(rest))) {
      i += m[0].length;
    } else if ((m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(rest))) {
      toks.push({ t: "num", v: Number(m[0]), s: i, e: i + m[0].length });
      i += m[0].length;
    } else if (rest[0] === '"') {
      let j = 1;
      let v = "";
      for (;;) {
        if (j >= rest.length) throw new FormulaError("A text value is missing its closing quote.");
        if (rest[j] === '"') {
          if (rest[j + 1] === '"') {
            v += '"';
            j += 2;
            continue;
          }
          break;
        }
        v += rest[j++];
      }
      toks.push({ t: "str", v, s: i, e: i + j + 1 });
      i += j + 1;
    } else if ((m = /^#(REF!|DIV\/0!|VALUE!|NAME\?|N\/A)/.exec(rest))) {
      toks.push({ t: "err", v: m[0], s: i, e: i + m[0].length });
      i += m[0].length;
    } else if ((m = /^([A-Za-z_][A-Za-z0-9_]*)?\[\s*(@?)\s*([^\[\]@]+?)\s*\]/.exec(rest))) {
      toks.push({ t: "sref", table: m[1] ?? null, thisRow: m[2] === "@", column: m[3], s: i, e: i + m[0].length });
      i += m[0].length;
    } else if ((m = /^(\$?)([A-Za-z]{1,2})(\$?)(\d+)(?![A-Za-z0-9_.(])/.exec(rest))) {
      toks.push({ t: "ref", col: colToIndex(m[2]), row: Number(m[4]) - 1, absCol: m[1] === "$", absRow: m[3] === "$", s: i, e: i + m[0].length });
      i += m[0].length;
    } else if ((m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(rest))) {
      toks.push({ t: "id", v: m[0].toUpperCase(), s: i, e: i + m[0].length });
      i += m[0].length;
    } else if ((m = /^(<=|>=|<>|[-+*/^&=<>(),:%])/.exec(rest))) {
      toks.push({ t: "op", v: m[0], s: i, e: i + m[0].length });
      i += m[0].length;
    } else {
      throw new FormulaError(`“${rest[0]}” is not something a formula can contain here.`);
    }
  }
  return toks;
}

/* ---------- copying a formula to another cell ---------- */

function refText(col: number, row: number, absCol: boolean, absRow: boolean) {
  return `${absCol ? "$" : ""}${indexToCol(col)}${absRow ? "$" : ""}${row + 1}`;
}

/**
 * The formula as it would read after being copied dRow rows down and dCol columns across:
 * relative parts of each reference move, parts locked with $ do not.
 */
export function shiftFormula(formula: string, dRow: number, dCol: number): string {
  if (!formula.startsWith("=")) return formula;
  const body = formula.slice(1);
  let toks: Tok[];
  try {
    toks = tokenize(body);
  } catch {
    return formula;
  }
  let out = "";
  let last = 0;
  for (const t of toks) {
    if (t.t !== "ref") continue;
    const col = t.absCol ? t.col : t.col + dCol;
    const row = t.absRow ? t.row : t.row + dRow;
    out += body.slice(last, t.s) + (col < 0 || row < 0 ? "#REF!" : refText(col, row, t.absCol, t.absRow));
    last = t.e;
  }
  return "=" + out + body.slice(last);
}

/* ---------- parser ---------- */

type Node =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "bool"; v: boolean }
  | { k: "err"; v: string }
  | { k: "ref"; c: number; r: number }
  | { k: "range"; c0: number; r0: number; c1: number; r1: number }
  | { k: "sref"; table: string | null; thisRow: boolean; column: string }
  | { k: "un"; op: string; a: Node }
  | { k: "pct"; a: Node }
  | { k: "bin"; op: string; a: Node; b: Node }
  | { k: "call"; name: string; args: Node[] };

function parse(src: string): Node {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && (peek() as { v: string }).v === v;
  const eat = (v: string) => {
    if (!isOp(v)) throw new FormulaError(v === ")" ? "A bracket is not closed." : `Expected “${v}”.`);
    p++;
  };

  function primary(): Node {
    const t = toks[p++];
    if (!t) throw new FormulaError("The formula ends too early.");
    switch (t.t) {
      case "num":
        return { k: "num", v: t.v };
      case "str":
        return { k: "str", v: t.v };
      case "err":
        return { k: "err", v: t.v };
      case "sref":
        return { k: "sref", table: t.table, thisRow: t.thisRow, column: t.column };
      case "ref": {
        if (isOp(":")) {
          p++;
          const u = toks[p++];
          if (!u || u.t !== "ref") throw new FormulaError("A range needs a cell on both sides of the colon, like B2:B8.");
          return { k: "range", c0: Math.min(t.col, u.col), r0: Math.min(t.row, u.row), c1: Math.max(t.col, u.col), r1: Math.max(t.row, u.row) };
        }
        return { k: "ref", c: t.col, r: t.row };
      }
      case "id": {
        if (isOp("(")) {
          p++;
          const args: Node[] = [];
          if (!isOp(")")) {
            do args.push(compare());
            while (isOp(",") && ++p);
          }
          eat(")");
          return { k: "call", name: t.v, args };
        }
        if (t.v === "TRUE") return { k: "bool", v: true };
        if (t.v === "FALSE") return { k: "bool", v: false };
        return { k: "err", v: "#NAME?" };
      }
      case "op":
        if (t.v === "(") {
          const n = compare();
          eat(")");
          return n;
        }
        throw new FormulaError(`“${t.v}” is in an unexpected place.`);
    }
  }
  function postfix(): Node {
    let n = primary();
    while (isOp("%")) {
      p++;
      n = { k: "pct", a: n };
    }
    return n;
  }
  function unary(): Node {
    if (isOp("-") || isOp("+")) {
      const op = (toks[p++] as { v: string }).v;
      return { k: "un", op, a: unary() };
    }
    return postfix();
  }
  const level = (next: () => Node, ops: string[]) => (): Node => {
    let n = next();
    while (peek()?.t === "op" && ops.includes((peek() as { v: string }).v)) {
      const op = (toks[p++] as { v: string }).v;
      n = { k: "bin", op, a: n, b: next() };
    }
    return n;
  };
  const power = level(unary, ["^"]);
  const mul = level(power, ["*", "/"]);
  const add = level(mul, ["+", "-"]);
  const concat = level(add, ["&"]);
  const compare: () => Node = level(concat, ["=", "<>", "<", ">", "<=", ">="]);

  if (!toks.length) throw new FormulaError("The formula is empty after the = sign.");
  const tree = compare();
  if (p < toks.length) throw new FormulaError("Something is left over at the end of the formula. Check for a missing operator or bracket.");
  return tree;
}

/** Returns a message if the formula cannot be parsed, otherwise null. */
export function syntaxProblem(formula: string): string | null {
  const f = formula.trim();
  if (!f.startsWith("=")) return "A formula starts with an = sign.";
  try {
    parse(f.slice(1));
    return null;
  } catch (e) {
    return e instanceof FormulaError ? e.message : "This formula could not be read.";
  }
}

/* ---------- evaluation helpers ---------- */

function num(v: Scalar): number | Err {
  if (isErr(v)) return v;
  if (v === null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  return v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : E("#VALUE!");
}
function text(v: Scalar): string | Err {
  if (isErr(v)) return v;
  if (v === null) return "";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  return String(v);
}
function compareScalars(a: Scalar, b: Scalar): number {
  const rank = (v: Scalar) => (typeof v === "number" || v === null ? 0 : typeof v === "string" ? 1 : 2);
  if (a === null && typeof b === "string") a = "";
  if (b === null && typeof a === "string") b = "";
  if (rank(a) !== rank(b)) return rank(a) - rank(b);
  if (typeof a === "string" && typeof b === "string") return a.toLowerCase().localeCompare(b.toLowerCase());
  const x = Number(a ?? 0);
  const y = Number(b ?? 0);
  return x < y ? -1 : x > y ? 1 : 0;
}
function roundTo(x: number, digits: number, mode: "half" | "up" | "down") {
  const f = 10 ** digits;
  const scaled = Math.abs(x) * f;
  const r = mode === "half" ? Math.round(scaled + 1e-9) : mode === "up" ? Math.ceil(scaled - 1e-9) : Math.floor(scaled + 1e-9);
  return (Math.sign(x) * r) / f;
}
function matcher(crit: Scalar): (v: Scalar) => boolean {
  if (typeof crit === "number") return (v) => v === crit;
  if (typeof crit === "boolean") return (v) => v === crit;
  const m = /^(>=|<=|<>|>|<|=)?([\s\S]*)$/.exec(String(crit ?? ""))!;
  const op = m[1] ?? "=";
  const operand = m[2];
  const n = operand.trim() !== "" && !Number.isNaN(Number(operand)) ? Number(operand) : null;
  if (n !== null) {
    return (v) => {
      if (typeof v !== "number") return op === "<>";
      return op === "=" ? v === n : op === "<>" ? v !== n : op === ">" ? v > n : op === ">=" ? v >= n : op === "<" ? v < n : v <= n;
    };
  }
  const re = new RegExp("^" + operand.replace(/[.+^${}()|\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
  return (v) => {
    const s = v === null ? "" : typeof v === "string" ? v : null;
    if (op === "=") return s !== null && re.test(s);
    if (op === "<>") return s === null || !re.test(s);
    if (s === null) return false;
    const c = s.toLowerCase().localeCompare(operand.toLowerCase());
    return op === ">" ? c > 0 : op === ">=" ? c >= 0 : op === "<" ? c < 0 : c <= 0;
  };
}

export const FUNCTIONS = [
  "SUM", "AVERAGE", "MIN", "MAX", "COUNT", "COUNTA", "COUNTBLANK", "ROUND", "ROUNDUP", "ROUNDDOWN", "ABS", "INT",
  "IF", "AND", "OR", "NOT", "IFERROR", "SUMIF", "COUNTIF", "AVERAGEIF", "LEN", "TRIM", "UPPER", "LOWER", "LEFT", "RIGHT",
];

/* ---------- sheet ---------- */

export class Sheet {
  readonly rowCount: number;
  readonly colCount: number;
  private memo = new Map<string, Scalar>();
  private visiting = new Set<string>();
  private tables: { name: string; c0: number; r0: number; c1: number; r1: number }[];

  /** `formulas` are placed on top of the spec's cells, keyed by address (e.g. "C2"). */
  constructor(
    readonly spec: SheetSpec,
    private formulas: Map<string, string> = new Map(),
  ) {
    this.rowCount = spec.rows.length;
    this.colCount = Math.max(...spec.rows.map((r) => r.length));
    this.tables = (spec.tables ?? []).map((t) => ({ name: t.name, ...parseRange(t.ref) }));
  }

  raw(c: number, r: number): Raw {
    const f = this.formulas.get(addrOf(c, r));
    if (f !== undefined) return f;
    return this.spec.rows[r]?.[c] ?? null;
  }
  formulaAt(c: number, r: number): string | null {
    const v = this.raw(c, r);
    return typeof v === "string" && v.startsWith("=") ? v : null;
  }

  value(c: number, r: number): Scalar {
    const key = addrOf(c, r);
    if (this.memo.has(key)) return this.memo.get(key)!;
    const raw = this.raw(c, r);
    let out: Scalar;
    if (typeof raw === "string" && raw.startsWith("=")) {
      if (this.visiting.has(key)) return E("#CYCLE!");
      this.visiting.add(key);
      try {
        const v = this.ev(parse(raw.slice(1)), c, r);
        out = isRng(v) ? (v.range.length === 1 && v.range[0].length === 1 ? v.range[0][0] : E("#VALUE!")) : v;
      } catch {
        out = E("#ERROR!");
      }
      this.visiting.delete(key);
    } else {
      out = raw;
    }
    this.memo.set(key, out);
    return out;
  }

  private rangeOf(c0: number, r0: number, c1: number, r1: number): Rng {
    const range: Scalar[][] = [];
    for (let r = r0; r <= r1; r++) {
      const row: Scalar[] = [];
      for (let c = c0; c <= c1; c++) row.push(this.value(c, r));
      range.push(row);
    }
    return { range };
  }

  private structured(n: Extract<Node, { k: "sref" }>, c: number, r: number): Val {
    const table = n.table
      ? this.tables.find((t) => t.name.toLowerCase() === n.table!.toLowerCase())
      : (this.tables.find((t) => r > t.r0 && r <= t.r1 && c >= t.c0 && c <= t.c1) ?? this.tables.find((t) => r > t.r0 && r <= t.r1));
    if (!table) return n.table ? E("#NAME?") : E("#VALUE!");
    let col = -1;
    for (let i = table.c0; i <= table.c1; i++) {
      if (String(this.raw(i, table.r0) ?? "").trim().toLowerCase() === n.column.trim().toLowerCase()) col = i;
    }
    if (col < 0) return E("#REF!");
    if (n.thisRow) return r > table.r0 && r <= table.r1 ? this.value(col, r) : E("#VALUE!");
    return this.rangeOf(col, table.r0 + 1, col, table.r1);
  }

  private scalar(n: Node, c: number, r: number): Scalar {
    const v = this.ev(n, c, r);
    if (!isRng(v)) return v;
    return v.range.length === 1 && v.range[0].length === 1 ? v.range[0][0] : E("#VALUE!");
  }

  private ev(n: Node, c: number, r: number): Val {
    switch (n.k) {
      case "num":
      case "str":
      case "bool":
        return n.v;
      case "err":
        return E(n.v);
      case "ref":
        return this.value(n.c, n.r);
      case "range":
        return this.rangeOf(n.c0, n.r0, n.c1, n.r1);
      case "sref":
        return this.structured(n, c, r);
      case "un": {
        const a = num(this.scalar(n.a, c, r));
        return isErr(a) ? a : n.op === "-" ? -a : a;
      }
      case "pct": {
        const a = num(this.scalar(n.a, c, r));
        return isErr(a) ? a : a / 100;
      }
      case "bin": {
        const A = this.scalar(n.a, c, r);
        const B = this.scalar(n.b, c, r);
        if (isErr(A)) return A;
        if (isErr(B)) return B;
        if (n.op === "&") return (text(A) as string) + (text(B) as string);
        if (["=", "<>", "<", ">", "<=", ">="].includes(n.op)) {
          const d = compareScalars(A, B);
          return n.op === "=" ? d === 0 : n.op === "<>" ? d !== 0 : n.op === "<" ? d < 0 : n.op === ">" ? d > 0 : n.op === "<=" ? d <= 0 : d >= 0;
        }
        const a = num(A);
        const b = num(B);
        if (isErr(a)) return a;
        if (isErr(b)) return b;
        switch (n.op) {
          case "+":
            return a + b;
          case "-":
            return a - b;
          case "*":
            return a * b;
          case "/":
            return b === 0 ? E("#DIV/0!") : a / b;
          default:
            return a ** b;
        }
      }
      case "call":
        return this.call(n.name, n.args, c, r);
    }
  }

  private call(name: string, args: Node[], c: number, r: number): Val {
    const vals = () => args.map((a) => this.ev(a, c, r));
    const s = (i: number) => this.scalar(args[i], c, r);
    const need = (min: number, max = min) => args.length >= min && args.length <= max;

    /** Numbers the way SUM sees them: text and blanks inside ranges are skipped. */
    const numbers = (): number[] | Err => {
      const out: number[] = [];
      for (const v of vals()) {
        if (isRng(v)) {
          for (const row of v.range)
            for (const cell of row) {
              if (isErr(cell)) return cell;
              if (typeof cell === "number") out.push(cell);
            }
        } else {
          if (v === null) continue;
          const x = num(v);
          if (isErr(x)) return x;
          out.push(x);
        }
      }
      return out;
    };
    const flat = (v: Val): Scalar[] => (isRng(v) ? v.range.flat() : [v]);

    switch (name) {
      case "SUM":
      case "AVERAGE":
      case "MIN":
      case "MAX":
      case "COUNT": {
        if (!args.length) return E("#VALUE!");
        if (name === "COUNT") return vals().flatMap(flat).filter((v) => typeof v === "number").length;
        const xs = numbers();
        if (isErr(xs)) return xs;
        if (name === "SUM") return xs.reduce((a, b) => a + b, 0);
        if (name === "AVERAGE") return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : E("#DIV/0!");
        return xs.length ? (name === "MIN" ? Math.min(...xs) : Math.max(...xs)) : 0;
      }
      case "COUNTA":
        return vals().flatMap(flat).filter((v) => v !== null && v !== "").length;
      case "COUNTBLANK":
        return vals().flatMap(flat).filter((v) => v === null || v === "").length;
      case "ROUND":
      case "ROUNDUP":
      case "ROUNDDOWN": {
        if (!need(2)) return E("#VALUE!");
        const x = num(s(0));
        const d = num(s(1));
        if (isErr(x)) return x;
        if (isErr(d)) return d;
        return roundTo(x, Math.trunc(d), name === "ROUND" ? "half" : name === "ROUNDUP" ? "up" : "down");
      }
      case "ABS":
      case "INT": {
        if (!need(1)) return E("#VALUE!");
        const x = num(s(0));
        return isErr(x) ? x : name === "ABS" ? Math.abs(x) : Math.floor(x);
      }
      case "IF": {
        if (!need(2, 3)) return E("#VALUE!");
        const cond = s(0);
        if (isErr(cond)) return cond;
        const t = typeof cond === "string" ? E("#VALUE!") : Boolean(cond);
        if (isErr(t)) return t;
        return t ? this.ev(args[1], c, r) : args[2] ? this.ev(args[2], c, r) : false;
      }
      case "AND":
      case "OR": {
        const bs: boolean[] = [];
        for (const v of vals().flatMap(flat)) {
          if (isErr(v)) return v;
          if (v === null || typeof v === "string") continue;
          bs.push(Boolean(v));
        }
        if (!bs.length) return E("#VALUE!");
        return name === "AND" ? bs.every(Boolean) : bs.some(Boolean);
      }
      case "NOT": {
        if (!need(1)) return E("#VALUE!");
        const v = s(0);
        return isErr(v) ? v : typeof v === "string" ? E("#VALUE!") : !v;
      }
      case "IFERROR": {
        if (!need(2)) return E("#VALUE!");
        const v = this.ev(args[0], c, r);
        return isErr(v) ? this.ev(args[1], c, r) : v;
      }
      case "SUMIF":
      case "COUNTIF":
      case "AVERAGEIF": {
        if (!need(2, name === "COUNTIF" ? 2 : 3)) return E("#VALUE!");
        const range = flat(this.ev(args[0], c, r));
        const crit = s(1);
        if (isErr(crit)) return crit;
        const hit = matcher(crit);
        if (name === "COUNTIF") return range.filter(hit).length;
        const target = args[2] ? flat(this.ev(args[2], c, r)) : range;
        const xs: number[] = [];
        for (let i = 0; i < range.length; i++) {
          if (!hit(range[i])) continue;
          const v = target[i] ?? null;
          if (isErr(v)) return v;
          if (typeof v === "number") xs.push(v);
        }
        const total = xs.reduce((a, b) => a + b, 0);
        if (name === "SUMIF") return total;
        return xs.length ? total / xs.length : E("#DIV/0!");
      }
      case "LEN":
      case "TRIM":
      case "UPPER":
      case "LOWER": {
        if (!need(1)) return E("#VALUE!");
        const t = text(s(0));
        if (isErr(t)) return t;
        return name === "LEN" ? t.length : name === "TRIM" ? t.trim().replace(/ +/g, " ") : name === "UPPER" ? t.toUpperCase() : t.toLowerCase();
      }
      case "LEFT":
      case "RIGHT": {
        if (!need(1, 2)) return E("#VALUE!");
        const t = text(s(0));
        const k = args[1] ? num(s(1)) : 1;
        if (isErr(t)) return t;
        if (isErr(k)) return k;
        return name === "LEFT" ? t.slice(0, k) : k === 0 ? "" : t.slice(-k);
      }
      default:
        return E("#NAME?");
    }
  }
}

/* ---------- display ---------- */

export function formatValue(v: Scalar, fmt?: Fmt): string {
  if (v === null) return "";
  if (isErr(v)) return v.error;
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "string") return v;
  switch (fmt) {
    case "money":
      return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
    case "pct":
      return (v * 100).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "%";
    case "int":
      return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    case "num2":
      return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    default:
      return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
  }
}
