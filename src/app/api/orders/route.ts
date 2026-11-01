import { NextResponse } from "next/server";
import { createOrder, OrderError } from "@/lib/orders";
import { getRecentShipments } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const shipments = await getRecentShipments(6);
    return NextResponse.json({ ok: true, shipments });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load shipments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await createOrder({
      vehicleSlug: String(body.vehicleSlug ?? ""),
      customerName: String(body.customerName ?? ""),
      customerEmail: String(body.customerEmail ?? ""),
      customerPhone: String(body.customerPhone ?? ""),
      deliveryCity: body.deliveryCity ? String(body.deliveryCity) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
    });

    return NextResponse.json(
      {
        ok: true,
        trackingCode: result.order.trackingCode,
        reference: result.order.reference,
        depositKes: result.order.depositKes,
        totalKes: result.order.totalKes,
        vehicle: `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}`,
        trackUrl: `/track/${result.order.trackingCode}`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("order create failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not open your import file. Please try again." },
      { status: 500 },
    );
  }
}
