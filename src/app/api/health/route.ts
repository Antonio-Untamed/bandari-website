import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    const dbError = error instanceof Error ? error : new Error(String(error));
    console.error("Health check database query failed", {
      name: dbError.name,
      message: dbError.message.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted database URL]"),
      code: "code" in dbError ? dbError.code : undefined,
    });
    return Response.json({ ok: false }, { status: 500 });
  }
}
