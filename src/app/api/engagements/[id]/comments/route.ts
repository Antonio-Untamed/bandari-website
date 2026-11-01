import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { engagementComments } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureDb();
    const { id } = await params;
    const engagementId = Number(id);
    if (!Number.isInteger(engagementId)) {
      return NextResponse.json({ ok: false, error: "Invalid engagement." }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const authorName = String(body.authorName ?? "").trim();
    const text = String(body.body ?? "").trim();

    if (authorName.length < 2) {
      return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
    }
    if (text.length < 2) {
      return NextResponse.json({ ok: false, error: "Write a short comment." }, { status: 400 });
    }

    const [comment] = await db
      .insert(engagementComments)
      .values({
        engagementId,
        authorName: authorName.slice(0, 80),
        body: text.slice(0, 500),
      })
      .returning();

    return NextResponse.json({ ok: true, comment }, { status: 201 });
  } catch (error) {
    console.error("comment failed", error);
    return NextResponse.json({ ok: false, error: "Could not post that comment." }, { status: 500 });
  }
}
