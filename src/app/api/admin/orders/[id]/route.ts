import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { AdminError, updateOrderShipping } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Admin sign-in required." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const orderId = Number(id);
    if (!Number.isInteger(orderId)) throw new AdminError("Invalid order.");
    const body = (await request.json()) as Record<string, unknown>;
    const order = await updateOrderShipping(orderId, body);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("admin order update failed", error);
    return NextResponse.json({ ok: false, error: "Could not update that shipment." }, { status: 500 });
  }
}
