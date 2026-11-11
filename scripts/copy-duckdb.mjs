// Copies the DuckDB WebAssembly engine from node_modules into /public so the browser can load it
// from this site instead of a third-party CDN. Runs before `dev` and `build`. The files are not committed.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@duckdb/duckdb-wasm/dist");
const dest = join(root, "public/duckdb");
mkdirSync(dest, { recursive: true });
for (const f of ["duckdb-eh.wasm", "duckdb-mvp.wasm", "duckdb-browser-eh.worker.js", "duckdb-browser-mvp.worker.js"]) {
  if (!existsSync(join(src, f))) throw new Error(`Missing ${f}. Run npm install first.`);
  cpSync(join(src, f), join(dest, f));
}
console.log("DuckDB engine copied to public/duckdb");
