/**
 * Validates a free-form sheet challenge: several independent target cells, each checked by
 * computed value against a reference formula — never by comparing formula text.
 */
import { sameValue } from "./check";
import { isErr, parseAddr, Sheet, syntaxProblem, type SheetSpec } from "./engine";

export type TargetResult = { addr: string; pass: boolean };
export type PlaygroundCheck = { pass: boolean; targets: TargetResult[]; feedback: string };

export function checkTargets(spec: SheetSpec, targets: string[], overrides: Map<string, string>, solution: Record<string, string>): PlaygroundCheck {
  for (const addr of targets) {
    const v = overrides.get(addr);
    if (v === undefined || v.trim() === "") return { pass: false, targets: targets.map((a) => ({ addr: a, pass: false })), feedback: `${addr} is still empty.` };
    if (v.startsWith("=")) {
      const problem = syntaxProblem(v);
      if (problem) return { pass: false, targets: targets.map((a) => ({ addr: a, pass: false })), feedback: `${addr}: ${problem}` };
    }
  }

  const learner = new Sheet(spec, overrides);
  const solved = new Sheet(spec, new Map(Object.entries(solution)));

  const results: TargetResult[] = targets.map((addr) => {
    const { c, r } = parseAddr(addr);
    const got = learner.value(c, r);
    const want = solved.value(c, r);
    return { addr, pass: sameValue(got, want) };
  });

  const pass = results.every((t) => t.pass);
  const bad = results.find((t) => !t.pass);
  let feedback = "";
  if (bad) {
    const { c, r } = parseAddr(bad.addr);
    const got = learner.value(c, r);
    feedback = isErr(got) ? `${bad.addr} gives ${got.error}. Check the formula there.` : `${bad.addr} doesn't match the expected result yet.`;
  }
  return { pass, targets: results, feedback };
}
