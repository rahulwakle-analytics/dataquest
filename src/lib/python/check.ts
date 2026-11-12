/**
 * Checks a learner's (or the reference) code for one Python Playground challenge against both
 * of its datasets — the same anti-hardcoding double-check the SQL and Excel playgrounds use: a
 * value that happens to fit one dataset but was never actually computed is caught by the other.
 */
import type { PythonChallenge } from "../../content/python-challenges";
import { runAndCheck, sameResult } from "./engine";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChallengeCheckResult = {
  pass: boolean;
  tests: { name: string; pass: boolean }[];
  feedback: string;
  stdout: string;
  error?: string;
};

export async function checkChallenge(pyodide: any, challenge: PythonChallenge, code: string): Promise<ChallengeCheckResult> {
  const cases = [
    { name: "Practice dataset", setup: challenge.setupMain },
    { name: "Second dataset with different data", setup: challenge.setupCheck },
  ];
  const tests: { name: string; pass: boolean }[] = [];
  let feedback = "";
  let stdout = "";
  let error: string | undefined;

  for (const c of cases) {
    const got = await runAndCheck(pyodide, c.setup, code, challenge.checkExpr);
    if (got.stdout) stdout = got.stdout;
    if (!got.ok) {
      tests.push({ name: c.name, pass: false });
      error = got.error;
      if (!feedback) feedback = `Your code raised an error: ${got.error}`;
      continue;
    }
    const want = await runAndCheck(pyodide, c.setup, challenge.solution, challenge.checkExpr);
    if (!want.ok) {
      tests.push({ name: c.name, pass: false });
      if (!feedback) feedback = "This challenge's reference solution failed to run. Please use the feedback button to report it.";
      continue;
    }
    const pass = sameResult(got.value, want.value);
    tests.push({ name: c.name, pass });
    if (!pass && !feedback)
      feedback =
        c.name === "Practice dataset"
          ? "Not quite — the result doesn't match yet."
          : "Your code matches on the practice dataset but not on a second dataset with different numbers. A value is probably typed in where it should be calculated.";
  }

  return { pass: tests.every((t) => t.pass), tests, feedback, stdout, error };
}
