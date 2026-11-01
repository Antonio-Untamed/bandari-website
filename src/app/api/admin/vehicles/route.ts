import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { AdminError, createVehicle } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Admin sign-in required." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const vehicle = await createVehicle(body);
    return NextResponse.json({ ok: true, vehicle }, { status: 201 });
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("admin vehicle create failed", error);
    return NextResponse.json({ ok: false, error: "Could not save that unit." }, { status: 500 });
  }
}
