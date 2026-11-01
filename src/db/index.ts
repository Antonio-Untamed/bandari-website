import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

/**
 * postgres.js is a pure-JS client. Unlike `pg`, it does not pull in
 * `pg-cloudflare`, which OpenNext cannot bundle. That is what crashed the
 * Cloudflare Workers build.
 *
 * The client is created lazily so `next build` / OpenNext can evaluate
 * server modules without a live database.
 */
type GlobalDb = typeof globalThis & {
  __bandariSql?: Sql;
};

const globalForDb = globalThis as GlobalDb;

function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.WORKERS_CI === "1") {
    return "postgresql://build:build@127.0.0.1:5432/build";
  }
  throw new Error("DATABASE_URL is required");
}

function shouldUseSsl(connectionString: string) {
  const value = connectionString.toLowerCase();
  if (value.includes("sslmode=disable") || value.includes("localhost") || value.includes("127.0.0.1")) {
    return false;
  }
  return (
    value.includes("sslmode=require") ||
    value.includes("neon.tech") ||
    value.includes("supabase.co") ||
    value.includes("amazonaws.com") ||
    value.includes("render.com") ||
    value.includes("railway") ||
    value.includes("pooler.supabase")
  );
}

function getSql() {
  if (globalForDb.__bandariSql) return globalForDb.__bandariSql;

  const connectionString = resolveDatabaseUrl();
  const sql = postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: shouldUseSsl(connectionString) ? "require" : false,
  });

  globalForDb.__bandariSql = sql;
  return sql;
}

const sqlClient = new Proxy(function dummy() {} as unknown as Sql, {
  get(_target, property, receiver) {
    const real = getSql() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(real, property, receiver);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(real) : value;
  },
  apply(_target, thisArg, args) {
    const real = getSql();
    return Reflect.apply(real as unknown as (...args: unknown[]) => unknown, thisArg ?? real, args);
  },
});

export const db = drizzle(sqlClient);
