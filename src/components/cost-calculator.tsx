"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { estimateLandedCost, type CostInput } from "@/lib/pricing";
import { KRA_SCHEDULE } from "@/lib/crsp";
import { kes, USD_TO_KES } from "@/lib/format";
import { ArrowRight, ShieldIcon } from "./icons";

export type CalculatorOption = {
  id: string;
  label: string;
  input: CostInput;
  href: string;
  priceUsd: number;
};

const pct = (rate: number) => `${Math.round(rate * 100)}%`;

export function CostCalculator({
  options,
  compact = false,
}: {
  options: CalculatorOption[];
  compact?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const [rate, setRate] = useState(USD_TO_KES);
  const [view, setView] = useState<"kra" | "landed">("kra");
  const active = options.find((option) => option.id === selectedId) ?? options[0];

  const cost = useMemo(() => {
    if (!active) return null;
    return estimateLandedCost(active.input, rate);
  }, [active, rate]);

  if (!active || !cost) return null;

  const kra = cost.kra;
  const shown = compact
    ? cost.lines.filter((line) =>
        ["Vehicle price (FOB)", "Ocean freight"].includes(line.label) ||
        line.label.startsWith("Import duty") ||
        line.label.startsWith("Excise") ||
        line.label.startsWith("VAT"),
      )
    : cost.lines;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line bg-sand/60 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
            KRA duty &amp; landed cost
          </p>
          <p className="mt-1 text-[11.5px] text-ink/55">
            {KRA_SCHEDULE.version} · duty on depreciated CRSP
          </p>
        </div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
          USD → KES
          <input
            type="number"
            min={100}
            max={250}
            step={0.5}
            value={rate}
            onChange={(event) => setRate(Number(event.target.value) || USD_TO_KES)}
            className="ml-2 w-16 rounded-lg border border-line bg-white px-2 py-1 text-[12px] font-semibold text-ink outline-none focus:border-moss"
          />
        </label>
      </div>

      <div className="p-5">
        <label className="label" htmlFor="calculator-vehicle">
          Vehicle
        </label>
        <select
          id="calculator-vehicle"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="field mb-4"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="mb-4 inline-flex rounded-full border border-line bg-cream p-1 text-[11.5px] font-semibold">
          <button
            type="button"
            onClick={() => setView("kra")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              view === "kra" ? "bg-forest text-cream" : "text-ink/55 hover:text-forest"
            }`}
          >
            KRA duty (CRSP)
          </button>
          <button
            type="button"
            onClick={() => setView("landed")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              view === "landed" ? "bg-forest text-cream" : "text-ink/55 hover:text-forest"
            }`}
          >
            Full landed cost
          </button>
        </div>

        {view === "kra" ? (
          <>
            <div className="rounded-xl border border-line bg-cream/60 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                    Total KRA taxes
                  </p>
                  <p className="display mt-1 text-[26px] text-forest">{kes(kra.totalTaxesKes)}</p>
                </div>
                <div className="text-right text-[11px] text-ink/50">
                  <p>
                    Effective tax load{" "}
                    <strong className="font-semibold text-ink/75">{pct(kra.effectiveRate)}</strong> of customs value
                  </p>
                  <p className="mt-0.5">
                    Basis:{" "}
                    <strong className="font-semibold text-forest">
                      {kra.valuationBasis === "crsp" ? "depreciated CRSP" : "declared CIF"}
                    </strong>
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11.5px] text-ink/60">
                <ShieldIcon className="h-4 w-4 shrink-0 text-fern" />
                KRA uses the higher of the depreciated CRSP and your declared CIF value.
              </div>
            </div>

            <dl className="mt-4 divide-y divide-line text-[12.5px]">
              {[
                {
                  label: "CRSP (new retail, revised)",
                  detail: `${KRA_SCHEDULE.version}`,
                  value: kes(kra.crspKes),
                  strong: true,
                },
                {
                  label: `Depreciation — ${kra.depreciationLabel}`,
                  detail: `Vehicle age ${kra.ageYears} year${kra.ageYears === 1 ? "" : "s"}`,
                  value: `− ${pct(kra.depreciationPct)}`,
                },
                {
                  label: "Depreciated CRSP (customs value)",
                  detail: "CRSP after age depreciation",
                  value: kes(kra.depreciatedCrspKes),
                  strong: true,
                },
                {
                  label: "Declared CIF value",
                  detail: "Vehicle + freight + insurance",
                  value: kes(kra.declaredCifKes),
                },
                {
                  label: `Import duty (${pct(kra.importDutyRate)})`,
                  detail:
                    kra.importDutyRate === 0.35
                      ? "Passenger vehicle band (HS 8703)"
                      : "Goods / commercial or electric band",
                  value: kes(kra.importDutyKes),
                },
                {
                  label: `Excise duty (${pct(kra.exciseRate)})`,
                  detail: `${kra.exciseBand} · on customs value + duty`,
                  value: kes(kra.exciseKes),
                },
                {
                  label: `IDF (${pct(KRA_SCHEDULE.idfRate)})`,
                  detail: "Import Declaration Fee",
                  value: kes(kra.idfKes),
                },
                {
                  label: `RDL (${pct(KRA_SCHEDULE.rdlRate)})`,
                  detail: "Railway Development Levy",
                  value: kes(kra.rdlKes),
                },
                {
                  label: `VAT (${pct(KRA_SCHEDULE.vatRate)})`,
                  detail: "On customs value + duty + excise + IDF + RDL",
                  value: kes(kra.vatKes),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
                  <dt>
                    <span className={`block ${row.strong ? "font-semibold text-ink" : "font-medium text-ink/80"}`}>
                      {row.label}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-ink/45">{row.detail}</span>
                  </dt>
                  <dd className={`shrink-0 tabular-nums ${row.strong ? "font-semibold text-forest" : "text-ink/75"}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-sand/50 px-2 py-3">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
                  Total KRA taxes
                </dt>
                <dd className="text-[14px] font-bold tabular-nums text-forest">{kes(kra.totalTaxesKes)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-forest p-4 text-cream">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/55">
                  Estimated drive-away total
                </p>
                <p className="display mt-1 text-[26px]">{kes(cost.totalKes)}</p>
                <p className="mt-1 text-[11.5px] text-cream/60">
                  includes {kes(cost.taxesKes)} KRA taxes, clearing, NTSA registration &amp; delivery
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/55">
                  30% deposit
                </p>
                <p className="mt-1 text-[18px] font-semibold">{kes(cost.depositKes)}</p>
                <p className="text-[11px] text-cream/55">balance on arrival</p>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-line text-[13px]">
              {shown.map((line) => (
                <li key={line.label} className="flex items-start justify-between gap-4 py-2.5">
                  <span>
                    <span className="font-medium text-ink">{line.label}</span>
                    {!compact ? (
                      <span className="mt-0.5 block text-[11px] leading-snug text-ink/45">{line.detail}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-ink/80">{kes(line.amountKes)}</span>
                </li>
              ))}
              {compact ? (
                <li className="flex items-center justify-between gap-4 py-2.5 text-[12px] text-ink/50">
                  <span>IDF, RDL, insurance, clearing &amp; registration shown in the full estimate</span>
                  <span className="shrink-0 font-medium">+</span>
                </li>
              ) : null}
            </ul>
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href={active.href} className="btn-primary !py-2.5 text-[13px]">
            Reserve this vehicle
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-[11px] text-ink/45">
            Indicative · confirmed on your KRA assessment &amp; proforma invoice
          </span>
        </div>
      </div>
    </div>
  );
}
