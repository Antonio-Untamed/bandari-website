import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { AdminError, deleteVehicle, updateVehicle } from "@/lib/admin";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Admin sign-in required." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const vehicleId = Number(id);
    if (!Number.isInteger(vehicleId)) throw new AdminError("Invalid unit.");
    const body = (await request.json()) as Record<string, unknown>;
    const vehicle = await updateVehicle(vehicleId, body);
    return NextResponse.json({ ok: true, vehicle });
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("admin vehicle update failed", error);
    return NextResponse.json({ ok: false, error: "Could not update that unit." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Admin sign-in required." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const vehicleId = Number(id);
    if (!Number.isInteger(vehicleId)) throw new AdminError("Invalid unit.");
    await deleteVehicle(vehicleId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("admin vehicle delete failed", error);
    return NextResponse.json({ ok: false, error: "Could not delete that unit." }, { status: 500 });
  }
}
