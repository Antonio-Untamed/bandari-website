import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

type GlobalDb = typeof globalThis & {
  __bandariPool?: Pool;
};

const globalForDb = globalThis as GlobalDb;

function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.WORKERS_CI === "1") {
    return "postgresql://127.0.0.1:5432/build";
  }
  throw new Error("DATABASE_URL is required");
}

function getPool() {
  if (globalForDb.__bandariPool) return globalForDb.__bandariPool;

  const pool = new Pool({
    connectionString: resolveDatabaseUrl(),
    max: 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  });

  globalForDb.__bandariPool = pool;
  return pool;
}

export const db = drizzle({ client: getPool() });
