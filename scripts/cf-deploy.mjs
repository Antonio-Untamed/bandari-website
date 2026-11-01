#!/usr/bin/env node
/**
 * Cloudflare Workers Builds has been skipping the Build step and running only
 * `npx wrangler deploy`. Wrangler then looks for `.open-next/assets`, does not
 * find it, and errors:
 *   Could not detect a directory containing static files
 *
 * Put this file in the dashboard **Deploy command**:
 *   node scripts/cf-deploy.mjs
 *
 * It installs dependencies, builds the OpenNext Worker, then deploys with the
 * local wrangler (not a random latest npx copy).
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://build:build@127.0.0.1:5432/build";
}

if (!existsSync("node_modules/next") || !existsSync("node_modules/@opennextjs/cloudflare")) {
  if (existsSync("package-lock.json")) {
    run("npm", ["ci"]);
  } else {
    run("npm", ["install"]);
  }
}

run(process.execPath, ["scripts/build.mjs", "--cloudflare"]);

if (!existsSync(".open-next/worker.js") || !existsSync(".open-next/assets")) {
  console.error("OpenNext build did not produce .open-next/worker.js and .open-next/assets");
  process.exit(1);
}

const wranglerBin = existsSync("node_modules/.bin/wrangler")
  ? "node_modules/.bin/wrangler"
  : null;

const wranglerArgs = ["deploy", "--name", "imports", "--config", "wrangler.jsonc"];
if (wranglerBin) {
  run(wranglerBin, wranglerArgs);
} else {
  run("npx", ["wrangler@4.86.0", ...wranglerArgs]);
}
