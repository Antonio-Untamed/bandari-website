#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args) {
    console.log(`\n$ ${command} ${args.join(" ")}\n`);
    const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
    if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
}

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://build:build@127.0.0.1:5432/build";
}

if (!existsSync("node_modules/next") || !existsSync("node_modules/@opennextjs/cloudflare")) {
    if (existsSync("package-lock.json")) {
          run("npm", ["ci"]);
    } else {
          run("npm", ["install", "--no-audit", "--no-fund"]);
    }
}

if (!existsSync(".open-next/worker.js") || !existsSync(".open-next/assets")) {
    run(process.execPath, ["scripts/build.mjs", "--cloudflare"]);
}

if (!existsSync(".open-next/worker.js") || !existsSync(".open-next/assets")) {
    console.error("OpenNext build did not produce .open-next/worker.js and .open-next/assets");
    process.exit(1);
}

const wranglerArgs = ["deploy", "--config", "wrangler.jsonc"];
const wranglerCli = "node_modules/wrangler/bin/wrangler.js";
if (existsSync(wranglerCli)) {
    run(process.execPath, [wranglerCli, ...wranglerArgs]);
} else {
    run("npx", ["wrangler", ...wranglerArgs]);
}
