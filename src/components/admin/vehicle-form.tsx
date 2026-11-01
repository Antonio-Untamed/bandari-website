"use client";

import { useState } from "react";
import type { Vehicle } from "@/db/schema";
import { computeKraDuty } from "@/lib/crsp";
import { kes, usd } from "@/lib/format";

const BODY_TYPES = ["SUV", "Pickup", "Sedan", "Hatchback", "Van", "Bus", "Truck"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const DRIVETRAINS = ["2WD", "4WD", "AWD"];
const ORIGINS = [
  { country: "Japan", port: "Yokohama" },
  { country: "Japan", port: "Nagoya" },
  { country: "United Kingdom", port: "Southampton" },
  { country: "United Arab Emirates", port: "Jebel Ali" },
  { country: "Thailand", port: "Laem Chabang" },
  { country: "South Africa", port: "Durban" },
];
const STATUSES = ["available", "reserved", "in_transit", "sold"];

type FormState = {
  make: string;
  model: string;
  year: string;
  trim: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  drivetrain: string;
  engineCc: string;
  mileageKm: string;
  color: string;
  condition: string;
  originCountry: string;
  originPort: string;
  priceUsd: string;
  freightUsd: string;
  crspKes: string;
  etaWeeks: string;
  inspectionGrade: string;
  status: string;
  featured: boolean;
  imageUrl: string;
  gallery: string;
  features: string;
};

function fromVehicle(vehicle?: Vehicle): FormState {
  return {
    make: vehicle?.make ?? "",
    model: vehicle?.model ?? "",
    year: String(vehicle?.year ?? new Date().getFullYear() - 3),
    trim: vehicle?.trim ?? "",
    bodyType: vehicle?.bodyType ?? "SUV",
    fuel: vehicle?.fuel ?? "Petrol",
    transmission: vehicle?.transmission ?? "Automatic",
    drivetrain: vehicle?.drivetrain ?? "2WD",
    engineCc: String(vehicle?.engineCc ?? 1500),
    mileageKm: String(vehicle?.mileageKm ?? 0),
    color: vehicle?.color ?? "Pearl White",
    condition: vehicle?.condition ?? "Used",
    originCountry: vehicle?.originCountry ?? "Japan",
    originPort: vehicle?.originPort ?? "Yokohama",
    priceUsd: String(vehicle?.priceUsd ?? ""),
    freightUsd: String(vehicle?.freightUsd ?? 1500),
    crspKes: String(vehicle?.crspKes ?? ""),
    etaWeeks: String(vehicle?.etaWeeks ?? 8),
    inspectionGrade: vehicle?.inspectionGrade ?? "Grade 4.5",
    status: vehicle?.status ?? "available",
    featured: vehicle?.featured ?? false,
    imageUrl: vehicle?.imageUrl ?? "",
    gallery: (vehicle?.gallery ?? []).join("\n"),
    features: (vehicle?.features ?? []).join(", "),
  };
}

export function VehicleForm({
  vehicle,
  onSaved,
  onCancel,
}: {
  vehicle?: Vehicle;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => fromVehicle(vehicle));
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const preview = computeKraDuty({
    crspKes: Number(form.crspKes) || 0,
    declaredCifKes: (Number(form.priceUsd) || 0) * 129 + (Number(form.freightUsd) || 0) * 129,
    year: Number(form.year) || new Date().getFullYear(),
    engineCc: Number(form.engineCc) || 1500,
    fuel: form.fuel,
    bodyType: form.bodyType,
  });

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !data.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
      update("imageUrl", data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        engineCc: Number(form.engineCc),
        mileageKm: Number(form.mileageKm),
        priceUsd: Number(form.priceUsd),
        freightUsd: Number(form.freightUsd),
        crspKes: Number(form.crspKes),
        etaWeeks: Number(form.etaWeeks),
        gallery: form.gallery.split(/\n+/).map((line) => line.trim()).filter(Boolean),
        features: form.features.split(/,|\n/).map((line) => line.trim()).filter(Boolean),
      };
      const response = await fetch(
        vehicle ? `/api/admin/vehicles/${vehicle.id}` : "/api/admin/vehicles",
        {
          method: vehicle ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not save this unit.");
      onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-moss/30 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-forest">
          {vehicle ? `Edit ${vehicle.make} ${vehicle.model}` : "Upload a unit for sale"}
        </h3>
        <button type="button" onClick={onCancel} className="text-[12px] font-medium text-ink/45 hover:text-forest">
          Close
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label">Make *</label>
          <input className="field" required value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="Toyota" />
        </div>
        <div>
          <label className="label">Model *</label>
          <input className="field" required value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="Land Cruiser Prado TX-L" />
        </div>
        <div>
          <label className="label">Trim</label>
          <input className="field" value={form.trim} onChange={(e) => update("trim", e.target.value)} placeholder="TX-L 2.8D" />
        </div>
        <div>
          <label className="label">Year *</label>
          <input className="field" type="number" min={1990} max={new Date().getFullYear() + 1} required value={form.year} onChange={(e) => update("year", e.target.value)} />
        </div>
        <div>
          <label className="label">Body type</label>
          <select className="field" value={form.bodyType} onChange={(e) => update("bodyType", e.target.value)}>
            {BODY_TYPES.map((body) => <option key={body}>{body}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Fuel</label>
          <select className="field" value={form.fuel} onChange={(e) => update("fuel", e.target.value)}>
            {FUELS.map((fuel) => <option key={fuel}>{fuel}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Transmission</label>
          <select className="field" value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
            {TRANSMISSIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Drivetrain</label>
          <select className="field" value={form.drivetrain} onChange={(e) => update("drivetrain", e.target.value)}>
            {DRIVETRAINS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Engine (cc)</label>
          <input className="field" type="number" min={0} value={form.engineCc} onChange={(e) => update("engineCc", e.target.value)} />
        </div>
        <div>
          <label className="label">Mileage (km)</label>
          <input className="field" type="number" min={0} value={form.mileageKm} onChange={(e) => update("mileageKm", e.target.value)} />
        </div>
        <div>
          <label className="label">Colour</label>
          <input className="field" value={form.color} onChange={(e) => update("color", e.target.value)} />
        </div>
        <div>
          <label className="label">Condition</label>
          <select className="field" value={form.condition} onChange={(e) => update("condition", e.target.value)}>
            <option>Used</option>
            <option>New</option>
            <option>Refurbished</option>
          </select>
        </div>
        <div>
          <label className="label">Origin market</label>
          <select
            className="field"
            value={`${form.originCountry}|${form.originPort}`}
            onChange={(e) => {
              const [country, port] = e.target.value.split("|");
              update("originCountry", country);
              update("originPort", port);
            }}
          >
            {ORIGINS.map((origin) => (
              <option key={`${origin.country}-${origin.port}`} value={`${origin.country}|${origin.port}`}>
                {origin.country} — {origin.port}
              </option>
            ))}
            <option value={`${form.originCountry}|${form.originPort}`}>
              {form.originCountry} — {form.originPort}
            </option>
          </select>
        </div>
        <div>
          <label className="label">Price (USD) *</label>
          <input className="field" type="number" min={0} required value={form.priceUsd} onChange={(e) => update("priceUsd", e.target.value)} placeholder="18500" />
        </div>
        <div>
          <label className="label">Freight (USD)</label>
          <input className="field" type="number" min={0} value={form.freightUsd} onChange={(e) => update("freightUsd", e.target.value)} />
        </div>
        <div>
          <label className="label">KRA CRSP (KES)</label>
          <input className="field" type="number" min={0} value={form.crspKes} onChange={(e) => update("crspKes", e.target.value)} placeholder="9095659" />
        </div>
        <div>
          <label className="label">ETA (weeks)</label>
          <input className="field" type="number" min={1} value={form.etaWeeks} onChange={(e) => update("etaWeeks", e.target.value)} />
        </div>
        <div>
          <label className="label">Inspection grade</label>
          <input className="field" value={form.inspectionGrade} onChange={(e) => update("inspectionGrade", e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="field" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-line pt-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <label className="label">Main photo *</label>
          <input className="field" required value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="/uploads/photo.jpg or https://…" />
          <div className="mt-2 flex items-center gap-2">
            <label className="btn-outline !py-2 text-[12px]">
              {uploading ? "Uploading…" : "Upload photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
            </label>
            <span className="text-[11px] text-ink/45">JPG, PNG or WebP · up to 6MB</span>
          </div>
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="Preview" className="mt-2 h-28 w-full rounded-xl object-cover" />
          ) : null}
        </div>
        <div>
          <label className="label">More photos (one URL per line)</label>
          <textarea className="field h-[74px] resize-none font-mono text-[11px]" value={form.gallery} onChange={(e) => update("gallery", e.target.value)} />
          <label className="label mt-2">Features (comma separated)</label>
          <textarea className="field h-[54px] resize-none text-[12px]" value={form.features} onChange={(e) => update("features", e.target.value)} />
        </div>
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-medium text-ink/70">
        <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-4 w-4 accent-[#0f3a2c]" />
        Feature on the homepage
      </label>

      <div className="mt-4 rounded-xl border border-line bg-sand/50 p-3.5 text-[11.5px] text-ink/65">
        <p className="font-semibold uppercase tracking-[0.14em] text-ink/45">Live duty preview</p>
        <p className="mt-1.5">
          CRSP {kes(preview.crspKes)} → depreciation {Math.round(preview.depreciationPct * 100)}% → customs value{" "}
          <strong>{kes(preview.customsValueKes)}</strong> → KRA taxes <strong>{kes(preview.totalTaxesKes)}</strong>{" "}
          (duty {Math.round(preview.importDutyRate * 100)}%, excise {Math.round(preview.exciseRate * 100)}%, VAT 16%)
        </p>
        <p className="mt-1 text-ink/45">
          Vehicle price {usd(Number(form.priceUsd) || 0)} · leave CRSP blank to use our derived benchmark.
        </p>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-clay/30 bg-clay-soft px-4 py-2.5 text-[12.5px] font-medium text-clay">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={pending || uploading} className="btn-primary !py-2.5 text-[13px]">
          {pending ? "Saving…" : vehicle ? "Save changes" : "Publish unit for sale"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline !py-2.5 text-[13px]">
          Cancel
        </button>
      </div>
    </form>
  );
}
