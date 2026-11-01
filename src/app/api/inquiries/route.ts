import { NextResponse } from "next/server";
import { saveInquiry } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please share your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    }

    const inquiry = await saveInquiry({
      name: name.slice(0, 100),
      email: email.slice(0, 160),
      phone: String(body.phone ?? "").slice(0, 40),
      budget: String(body.budget ?? "").slice(0, 60),
      message: String(body.message ?? "").slice(0, 900),
    });

    return NextResponse.json({ ok: true, id: inquiry?.id }, { status: 201 });
  } catch (error) {
    console.error("inquiry failed", error);
    return NextResponse.json({ ok: false, error: "Could not send your request." }, { status: 500 });
  }
}
