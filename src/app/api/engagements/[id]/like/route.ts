import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { engagements } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureDb();
    const { id } = await params;
    const engagementId = Number(id);
    if (!Number.isInteger(engagementId)) {
      return NextResponse.json({ ok: false, error: "Invalid engagement." }, { status: 400 });
    }

    const rows = await db
      .update(engagements)
      .set({ likes: sql`${engagements.likes} + 1` })
      .where(eq(engagements.id, engagementId))
      .returning({ likes: engagements.likes });

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Engagement not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, likes: rows[0].likes });
  } catch (error) {
    console.error("like failed", error);
    return NextResponse.json({ ok: false, error: "Could not register that." }, { status: 500 });
  }
}
