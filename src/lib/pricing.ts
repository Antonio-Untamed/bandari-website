import { USD_TO_KES } from "./format";
import { computeKraDuty, derivedCrspKes, KRA_SCHEDULE, type KraDuty } from "./crsp";

export type CostInput = {
  priceUsd: number;
  freightUsd: number;
  insuranceUsd: number;
  engineCc: number;
  fuel: string;
  bodyType: string;
  year: number;
  crspKes: number;
};

export type CostLine = {
  label: string;
  detail: string;
  amountKes: number;
  emphasis?: boolean;
};

export type LandedCost = {
  rate: number;
  fobKes: number;
  freightKes: number;
  insuranceKes: number;
  cifKes: number;
  dutyKes: number;
  exciseKes: number;
  idfKes: number;
  rdlKes: number;
  vatKes: number;
  taxesKes: number;
  fixedKes: number;
  totalKes: number;
  depositKes: number;
  balanceKes: number;
  kra: KraDuty;
  lines: CostLine[];
};

const round = (n: number) => Math.round(n);
const pct = (rate: number) => `${Math.round(rate * 100)}%`;

/**
 * Indicative Kenyan landed cost. Customs value and all KRA taxes are derived
 * from the CRSP (revised) valuation, compared against the declared CIF value.
 */
export function estimateLandedCost(input: CostInput, rate: number = USD_TO_KES): LandedCost {
  const scale = rate / USD_TO_KES;
  const fobKes = input.priceUsd * rate;
  const freightKes = input.freightUsd * rate;
  const insuranceKes =
    input.insuranceUsd > 0
      ? input.insuranceUsd * rate
      : Math.max(round(fobKes * 0.015), 25000);
  const cifKes = fobKes + freightKes + insuranceKes;

  const crspKes =
    input.crspKes > 0
      ? Math.round(input.crspKes * scale)
      : round(derivedCrspKes(input.priceUsd, rate));

  const kra = computeKraDuty({
    crspKes,
    declaredCifKes: round(cifKes),
    year: input.year,
    engineCc: input.engineCc,
    fuel: input.fuel,
    bodyType: input.bodyType,
  });

  const fixedKes = round(132000 * scale);
  const taxesKes = kra.totalTaxesKes;
  const totalKes = round(cifKes + taxesKes + fixedKes);
  const depositKes = round(totalKes * 0.3);

  const lines: CostLine[] = [
    {
      label: "Vehicle price (FOB)",
      detail: "Auction / dealer price in the origin country",
      amountKes: round(fobKes),
    },
    {
      label: "Ocean freight",
      detail: "RoRo to Mombasa",
      amountKes: round(freightKes),
    },
    {
      label: "Marine insurance",
      detail: "1.5% of vehicle value (minimum KSh 25,000)",
      amountKes: round(insuranceKes),
    },
    {
      label: `Import duty (${pct(kra.importDutyRate)})`,
      detail: `On customs value of ${kra.customsValueKes.toLocaleString("en-KE")} KES`,
      amountKes: kra.importDutyKes,
    },
    {
      label: `Excise duty (${pct(kra.exciseRate)})`,
      detail: kra.exciseBand,
      amountKes: kra.exciseKes,
    },
    {
      label: `IDF (${pct(KRA_SCHEDULE.idfRate)})`,
      detail: "Import Declaration Fee on customs value",
      amountKes: kra.idfKes,
    },
    {
      label: `RDL (${pct(KRA_SCHEDULE.rdlRate)})`,
      detail: "Railway Development Levy on customs value",
      amountKes: kra.rdlKes,
    },
    {
      label: `VAT (${pct(KRA_SCHEDULE.vatRate)})`,
      detail: "On customs value + duty + excise + IDF + RDL",
      amountKes: kra.vatKes,
    },
    {
      label: "Clearing, registration & delivery",
      detail: "Clearing agent, KPA handling, NTSA plates, inland transport",
      amountKes: fixedKes,
    },
  ];

  return {
    rate,
    fobKes,
    freightKes,
    insuranceKes,
    cifKes,
    dutyKes: kra.importDutyKes,
    exciseKes: kra.exciseKes,
    idfKes: kra.idfKes,
    rdlKes: kra.rdlKes,
    vatKes: kra.vatKes,
    taxesKes,
    fixedKes,
    totalKes,
    depositKes,
    balanceKes: totalKes - depositKes,
    kra,
    lines,
  };
}

export function costInputFromVehicle(vehicle: {
  priceUsd: number;
  freightUsd: number;
  insuranceUsd: number;
  engineCc: number;
  fuel: string;
  bodyType: string;
  year: number;
  crspKes: number;
}): CostInput {
  return {
    priceUsd: vehicle.priceUsd,
    freightUsd: vehicle.freightUsd,
    insuranceUsd: vehicle.insuranceUsd,
    engineCc: vehicle.engineCc,
    fuel: vehicle.fuel,
    bodyType: vehicle.bodyType,
    year: vehicle.year,
    crspKes: vehicle.crspKes,
  };
}
