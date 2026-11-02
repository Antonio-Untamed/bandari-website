#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env, shell: false });
  if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://build:build@127.0.0.1:5432/build";
}

if (!existsSync("node_modules/next") || !existsSync("node_modules/@opennextjs/cloudflare")) {
  run("npm", ["install", "--no-audit", "--no-fund"]);
}

run("npx", ["opennextjs-cloudflare@1.19.10", "build"]);
