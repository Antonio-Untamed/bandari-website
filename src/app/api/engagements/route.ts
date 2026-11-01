import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { engagements } from "@/db/schema";
import { getEngagements } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getEngagements();
    return NextResponse.json({ ok: true, posts });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load engagements." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    const body = (await request.json()) as Record<string, unknown>;

    const authorName = String(body.authorName ?? "").trim();
    const city = String(body.city ?? "").trim();
    const title = String(body.title ?? "").trim();
    const text = String(body.body ?? "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (authorName.length < 2) {
      return NextResponse.json({ ok: false, error: "Please share your name." }, { status: 400 });
    }
    if (city.length < 2) {
      return NextResponse.json({ ok: false, error: "Which town are you in?" }, { status: 400 });
    }
    if (title.length < 4) {
      return NextResponse.json({ ok: false, error: "Add a short headline." }, { status: 400 });
    }
    if (text.length < 20) {
      return NextResponse.json(
        { ok: false, error: "Tell us a little more — at least 20 characters." },
        { status: 400 },
      );
    }

    const [post] = await db
      .insert(engagements)
      .values({
        authorName: authorName.slice(0, 80),
        city: city.slice(0, 60),
        rating,
        title: title.slice(0, 120),
        body: text.slice(0, 900),
        vehicleName: String(body.vehicleName ?? "").slice(0, 100),
        trackingCode: String(body.trackingCode ?? "").toUpperCase().slice(0, 24),
      })
      .returning();

    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (error) {
    console.error("engagement create failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not publish your engagement right now." },
      { status: 500 },
    );
  }
}
