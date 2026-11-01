"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order, Vehicle } from "@/db/schema";
import { VehicleForm } from "./vehicle-form";
import { SHIPPING_STAGES } from "@/lib/shipping";
import { kes } from "@/lib/format";
import { SITE, waCallbackMessage, waLink } from "@/lib/site";
import { ArrowUpRight, PinIcon } from "@/components/icons";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  createdAt: string | Date;
};

type OrderRow = { order: Order; vehicle: Vehicle };

type Tab = "units" | "orders" | "callbacks";

export function AdminDashboard({
  vehicles,
  orders,
  inquiries,
  stats,
}: {
  vehicles: Vehicle[];
  orders: OrderRow[];
  inquiries: Inquiry[];
  stats: { units: number; available: number; orders: number; delivered: number; inquiries: number };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("units");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  function done(text: string) {
    setMessage(text);
    setCreating(false);
    setEditingId(null);
    router.refresh();
    window.setTimeout(() => setMessage(""), 5000);
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this unit? Units with orders are marked sold instead.")) return;
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      done(data.ok ? "Unit removed." : (data.error ?? "Could not delete that unit."));
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "units", label: "Units for sale", count: stats.units },
    { id: "orders", label: "Shipments", count: stats.orders },
    { id: "callbacks", label: "Callbacks", count: stats.inquiries },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Import desk · staff</span>
          <h1 className="display mt-2 text-[34px] text-forest sm:text-[42px]">Control room</h1>
          <p className="mt-2 text-[13px] text-ink/60">
            Upload stock, move shipments between stages and follow up on callback requests.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/vehicles" className="btn-outline !py-2.5 text-[12.5px]">
            View live site
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={logout} className="btn-primary !py-2.5 text-[12.5px]">
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Units live", value: stats.available },
          { label: "Total files", value: stats.orders },
          { label: "Delivered", value: stats.delivered },
          { label: "Callbacks", value: stats.inquiries },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="display text-[26px] text-forest">{stat.value}</p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-ink/45">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-line">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-[13px] font-semibold transition ${
              tab === item.id
                ? "border-forest text-forest"
                : "border-transparent text-ink/50 hover:text-forest"
            }`}
          >
            {item.label}
            <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[10.5px] text-ink/60">{item.count}</span>
          </button>
        ))}
      </div>

      {message ? (
        <p className="mt-4 rounded-xl border border-fern/30 bg-sage/60 px-4 py-2.5 text-[12.5px] font-medium text-forest">
          {message}
        </p>
      ) : null}

      {tab === "units" ? (
        <section className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-forest">Inventory</h2>
            {!creating ? (
              <button type="button" onClick={() => { setCreating(true); setEditingId(null); }} className="btn-clay !py-2.5 text-[12.5px]">
                + Upload a unit
              </button>
            ) : null}
          </div>

          {creating ? (
            <div className="mt-4">
              <VehicleForm onSaved={() => done("Unit published to the live site.")} onCancel={() => setCreating(false)} />
            </div>
          ) : null}

          <div className="mt-4 space-y-3">
            {vehicles.map((vehicle) =>
              editingId === vehicle.id ? (
                <VehicleForm
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSaved={() => done("Unit updated.")}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <article key={vehicle.id} className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vehicle.imageUrl} alt="" className="h-20 w-full rounded-lg object-cover sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-forest">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">
                        {vehicle.status.replace("_", " ")}
                      </span>
                      {vehicle.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-clay-soft px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-clay">
                          <PinIcon className="h-2.5 w-2.5" /> featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-ink/50">
                      {vehicle.trim || vehicle.bodyType} · {vehicle.mileageKm.toLocaleString()} km ·{" "}
                      {vehicle.originPort} · CRSP {vehicle.crspKes > 0 ? kes(vehicle.crspKes) : "derived"} · $
                      {vehicle.priceUsd.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link href={`/vehicles/${vehicle.slug}`} className="btn-outline !px-3 !py-1.5 text-[11.5px]">
                      View
                    </Link>
                    <button type="button" onClick={() => { setEditingId(vehicle.id); setCreating(false); }} className="btn-primary !px-3 !py-1.5 text-[11.5px]">
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyId === vehicle.id}
                      onClick={() => void remove(vehicle.id)}
                      className="btn !border !border-clay/30 !bg-white !px-3 !py-1.5 text-[11.5px] !text-clay hover:!bg-clay-soft"
                    >
                      {busyId === vehicle.id ? "…" : "Delete"}
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      ) : null}

      {tab === "orders" ? (
        <section className="mt-5 space-y-3">
          <h2 className="text-[15px] font-semibold text-forest">Shipments</h2>
          {orders.length === 0 ? (
            <p className="card p-6 text-[13px] text-ink/55">No orders yet. They appear here automatically.</p>
          ) : null}
          {orders.map((row) => (
            <OrderCard key={row.order.id} row={row} onSaved={done} />
          ))}
        </section>
      ) : null}

      {tab === "callbacks" ? (
        <section className="mt-5 space-y-3">
          <h2 className="text-[15px] font-semibold text-forest">Callback requests</h2>
          <p className="text-[12px] text-ink/50">
            Every website callback is saved here and pushed straight to your WhatsApp on{" "}
            {SITE.whatsappDisplay}.
          </p>
          {inquiries.length === 0 ? (
            <p className="card p-6 text-[13px] text-ink/55">No callback requests yet.</p>
          ) : null}
          {inquiries.map((inquiry) => {
            const digits = inquiry.phone.replace(/\D/g, "");
            const clientNumber = digits.length >= 9 ? digits : "";
            return (
              <article key={inquiry.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[13.5px] font-semibold text-forest">{inquiry.name}</p>
                    <p className="text-[11.5px] text-ink/50">
                      {inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ""}{" "}
                      {inquiry.budget ? `· budget ${inquiry.budget}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={waLink(waCallbackMessage(inquiry), clientNumber ? `254${clientNumber.slice(-9)}` : SITE.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn !bg-[#25D366] !px-3 !py-1.5 text-[11.5px] !text-white"
                    >
                      Reply on WhatsApp
                    </a>
                    <a href={`mailto:${inquiry.email}`} className="btn-outline !px-3 !py-1.5 text-[11.5px]">
                      Email
                    </a>
                  </div>
                </div>
                {inquiry.message ? (
                  <p className="mt-2 rounded-lg bg-sand/60 px-3 py-2 text-[12.5px] text-ink/65">{inquiry.message}</p>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

function OrderCard({ row, onSaved }: { row: OrderRow; onSaved: (message: string) => void }) {
  const { order, vehicle } = row;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    stage: order.stage,
    vesselName: order.vesselName,
    voyageNumber: order.voyageNumber,
    billOfLading: order.billOfLading,
    etd: order.etd,
    eta: order.eta,
  });

  async function save() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not update this shipment.");
      onSaved(`${order.trackingCode} moved to ${SHIPPING_STAGES[form.stage].label}.`);
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vehicle.imageUrl} alt="" className="h-12 w-16 rounded-lg object-cover" />
          <div>
            <p className="text-[13px] font-semibold text-forest">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-[11.5px] text-ink/50">
              <span className="font-mono">{order.trackingCode}</span> · {order.customerName} ·{" "}
              {order.customerPhone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/60">
            {SHIPPING_STAGES[order.stage]?.short ?? "—"}
          </span>
          <button type="button" onClick={() => setOpen((value) => !value)} className="btn-primary !px-3 !py-1.5 text-[11.5px]">
            {open ? "Close" : "Update stage"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-3 rounded-xl border border-line bg-sand/40 p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-[11.5px] font-medium text-ink/60">
              Stage
              <select
                className="field mt-1"
                value={form.stage}
                onChange={(event) => setForm({ ...form, stage: Number(event.target.value) })}
              >
                {SHIPPING_STAGES.map((stage, index) => (
                  <option key={stage.key} value={index}>{index + 1}. {stage.label}</option>
                ))}
              </select>
            </label>
            <label className="text-[11.5px] font-medium text-ink/60">
              Vessel
              <input className="field mt-1" value={form.vesselName} onChange={(event) => setForm({ ...form, vesselName: event.target.value })} placeholder="Hoegh Trapper" />
            </label>
            <label className="text-[11.5px] font-medium text-ink/60">
              Voyage
              <input className="field mt-1" value={form.voyageNumber} onChange={(event) => setForm({ ...form, voyageNumber: event.target.value })} />
            </label>
            <label className="text-[11.5px] font-medium text-ink/60">
              Bill of lading
              <input className="field mt-1" value={form.billOfLading} onChange={(event) => setForm({ ...form, billOfLading: event.target.value })} />
            </label>
            <label className="text-[11.5px] font-medium text-ink/60">
              ETD
              <input className="field mt-1" type="date" value={form.etd} onChange={(event) => setForm({ ...form, etd: event.target.value })} />
            </label>
            <label className="text-[11.5px] font-medium text-ink/60">
              ETA
              <input className="field mt-1" type="date" value={form.eta} onChange={(event) => setForm({ ...form, eta: event.target.value })} />
            </label>
          </div>
          {error ? <p className="mt-2 text-[12px] font-medium text-clay">{error}</p> : null}
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={save} disabled={pending} className="btn-clay !py-2 text-[12.5px]">
              {pending ? "Saving…" : "Save & notify client"}
            </button>
            <Link href={`/track/${order.trackingCode}`} className="text-[12px] font-semibold text-moss hover:underline">
              Open client view →
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}
