#!/usr/bin/env node
/**
 * Cloudflare Workers Builds runs `npm run build` with WORKERS_CI=1, then
 * `npx wrangler deploy`. A plain `next build` does not emit .open-next/worker.js,
 * which is why the dashboard build fails after a few seconds.
 *
 * Locally / Docker / Vercel we keep the standard Next.js build.
 */
import { spawnSync } from "node:child_process";

const onWorkersCi =
  process.env.WORKERS_CI === "1" ||
  process.env.CLOUDFLARE_BUILD === "1" ||
  process.argv.includes("--cloudflare");

if (!process.env.DATABASE_URL) {
  // next build evaluates server modules. A dummy URL is enough for compile;
  // runtime still requires a real DATABASE_URL secret on the Worker.
  process.env.DATABASE_URL = "postgresql://build:build@127.0.0.1:5432/build";
}

const args = onWorkersCi
  ? ["opennextjs-cloudflare", "build"]
  : ["next", "build"];

const result = spawnSync("npx", args, {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
