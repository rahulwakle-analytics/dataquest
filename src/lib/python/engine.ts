/**
 * Browser Python engine. Code runs in Pyodide (CPython compiled to WebAssembly) entirely inside
 * the learner's browser tab — nothing is sent to a server. The runtime (core interpreter, plus
 * the numpy and pandas wheels these challenges need) is self-hosted under /pyodide/ rather than
 * fetched from a third-party CDN, so the playground works without any outside dependency.
 *
 * Checking is value-based, never string-based: setup code builds the input data, the learner's
 * (or the reference) code runs against it, and a check expression is evaluated afterwards and
 * compared as data (numbers/strings/lists/dicts), the same philosophy as the SQL and Excel
 * playgrounds.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const TIME_LIMIT_MS = 10000;

export class PythonError extends Error {}

export type RunOutcome = { ok: true; value: unknown; stdout: string } | { ok: false; error: string; stdout: string };

let enginePromise: Promise<any> | null = null;

/**
 * Loads Pyodide via a plain `<script>` tag rather than an npm import. Pyodide's published build
 * is universal (Node + browser) and its own dynamic-import-based browser loader doesn't survive
 * webpack bundling reliably; a script tag sidesteps the bundler entirely and sets a `loadPyodide`
 * global, the same way the project's SQL engine keeps DuckDB-WASM's loader out of the module
 * graph by instantiating it as a Worker from a URL instead of importing it.
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(el);
  });
}

async function boot(indexURL: string): Promise<any> {
  await loadScript(indexURL + "pyodide.js");
  const loadPyodide = (window as any).loadPyodide;
  const pyodide = await loadPyodide({ indexURL });
  await pyodide.loadPackage(["numpy", "pandas"]);
  return pyodide;
}

/** Lazily boots the shared browser engine (core + numpy/pandas), cached for the session. */
export function getEngine(): Promise<any> {
  if (!enginePromise) {
    const indexURL = window.location.origin + "/pyodide/";
    enginePromise = boot(indexURL).catch((e) => {
      enginePromise = null;
      throw e;
    });
  }
  return enginePromise;
}

function friendlyError(raw: string): string {
  const lines = raw.trim().split("\n").filter(Boolean);
  return lines[lines.length - 1] ?? raw;
}

/**
 * Runs `setup` then `code` in a fresh namespace, then evaluates `checkExpr` in that same
 * namespace and returns it as plain JSON-shaped data (so results are ordinary JS values, never
 * Pyodide proxies the caller has to manage or destroy).
 */
export async function runAndCheck(pyodide: any, setup: string, code: string, checkExpr: string): Promise<RunOutcome> {
  const ns = pyodide.globals.get("dict")();
  const stdoutBuf: string[] = [];
  pyodide.setStdout({ batched: (s: string) => stdoutBuf.push(s) });
  pyodide.setStderr({ batched: () => {} });
  try {
    const script = [
      setup,
      code,
      "import json as __dq_json",
      `__dq_result = __dq_json.dumps((${checkExpr}), default=str, sort_keys=True)`,
      "__dq_result",
    ].join("\n");
    const resultStr = await pyodide.runPythonAsync(script, { globals: ns });
    return { ok: true, value: JSON.parse(resultStr), stdout: stdoutBuf.join("\n") };
  } catch (e: any) {
    return { ok: false, error: friendlyError(String(e?.message ?? e)), stdout: stdoutBuf.join("\n") };
  } finally {
    ns.destroy();
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
}

/** Deep, float-tolerant comparison of two JSON-shaped values (numbers, strings, lists, dicts). */
export function sameResult(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return a === b || Math.abs(a - b) < 1e-6;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => sameResult(x, b[i]));
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    const ak = Object.keys(a as Record<string, unknown>).sort();
    const bk = Object.keys(b as Record<string, unknown>).sort();
    if (ak.length !== bk.length || ak.some((k, i) => k !== bk[i])) return false;
    return ak.every((k) => sameResult((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return a === b;
}
