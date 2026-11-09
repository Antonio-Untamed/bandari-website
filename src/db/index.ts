import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.WORKERS_CI === "1") {
    return "postgresql://127.0.0.1:5432/build";
  }
  throw new Error("DATABASE_URL is required");
}

export const db = drizzle({ client: neon(resolveDatabaseUrl()) });
