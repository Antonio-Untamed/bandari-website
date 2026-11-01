/**
 * Indicative KRA customs duty engine.
 *
 * Valuation follows the CRSP (Current Retail Selling Price) method used for
 * used-vehicle imports: start from KRA's published CRSP for the model, apply the
 * age-based depreciation to reach the customs value, then compare it with the
 * declared CIF value and tax whichever is higher.
 *
 * Rates reflect the July 2025 revised CRSP schedule and current Finance Act
 * excise bands. Figures are indicative and are confirmed on the KRA assessment
 * at Mombasa.
 */
import { USD_TO_KES } from "./format";

export const KRA_SCHEDULE = {
  version: "July 2025 revised CRSP schedule",
  rate: USD_TO_KES,
  idfRate: 0.035,
  rdlRate: 0.02,
  vatRate: 0.16,
} as const;

export type DepreciationBand = {
  maxAge: number;
  pct: number;
  label: string;
};

/** Age-based depreciation applied to CRSP (capped at 65%). */
export const DEPRECIATION_BANDS: DepreciationBand[] = [
  { maxAge: 1, pct: 0, label: "Up to 1 year" },
  { maxAge: 2, pct: 0.2, label: "Over 1 – 2 years" },
  { maxAge: 3, pct: 0.3, label: "Over 2 – 3 years" },
  { maxAge: 4, pct: 0.4, label: "Over 3 – 4 years" },
  { maxAge: 5, pct: 0.5, label: "Over 4 – 5 years" },
  { maxAge: 6, pct: 0.55, label: "Over 5 – 6 years" },
  { maxAge: 7, pct: 0.6, label: "Over 6 – 7 years" },
  { maxAge: 99, pct: 0.65, label: "7 years and older" },
];

export function depreciationFor(ageYears: number): DepreciationBand {
  const age = Math.max(ageYears, 0);
  return DEPRECIATION_BANDS.find((band) => age < band.maxAge) ?? DEPRECIATION_BANDS[DEPRECIATION_BANDS.length - 1];
}

export function vehicleAge(year: number, now: Date = new Date()) {
  return Math.max(now.getFullYear() - year, 0);
}

export function isElectric(fuel: string) {
  return fuel.toLowerCase().includes("electric");
}

export function isCommercial(bodyType: string) {
  return /pickup|truck|lorry|van|bus/i.test(bodyType);
}

/** Import duty on the customs value: goods vehicles 25%, passenger cars 35%, EV 25%. */
export function importDutyRate(bodyType: string, fuel: string) {
  if (isElectric(fuel)) return 0.25;
  if (isCommercial(bodyType)) return 0.25;
  return 0.35;
}

/** Excise duty (Finance Act bands), charged on customs value + import duty. */
export function exciseRateFor(engineCc: number, fuel: string) {
  const electric = isElectric(fuel);
  if (electric) return 0.1;
  if (fuel.toLowerCase().includes("hybrid")) return 0.1;
  const diesel = fuel.toLowerCase().includes("diesel");
  if (diesel) return engineCc <= 2500 ? 0.25 : 0.35;
  if (engineCc <= 1500) return 0.2;
  if (engineCc <= 3000) return 0.25;
  return 0.35;
}

export function exciseBandLabel(engineCc: number, fuel: string) {
  if (isElectric(fuel)) return "100% electric vehicle band";
  if (fuel.toLowerCase().includes("hybrid")) return "Petrol-electric hybrid band";
  if (fuel.toLowerCase().includes("diesel")) {
    return engineCc <= 2500 ? "Diesel up to 2,500cc" : "Diesel above 2,500cc";
  }
  if (engineCc <= 1500) return "Petrol up to 1,500cc";
  if (engineCc <= 3000) return "Petrol 1,501 – 3,000cc";
  return "Petrol above 3,000cc";
}

export type KraDutyInput = {
  crspKes: number;
  declaredCifKes: number;
  year: number;
  engineCc: number;
  fuel: string;
  bodyType: string;
};

export type KraDuty = {
  crspKes: number;
  depreciationPct: number;
  depreciationLabel: string;
  ageYears: number;
  depreciatedCrspKes: number;
  declaredCifKes: number;
  customsValueKes: number;
  valuationBasis: "crsp" | "cif";
  importDutyRate: number;
  importDutyKes: number;
  exciseBaseKes: number;
  exciseRate: number;
  exciseBand: string;
  exciseKes: number;
  idfKes: number;
  rdlKes: number;
  vatBaseKes: number;
  vatKes: number;
  totalTaxesKes: number;
  effectiveRate: number;
  schedule: string;
};

const round = (value: number) => Math.round(value);

export function computeKraDuty(input: KraDutyInput): KraDuty {
  const ageYears = vehicleAge(input.year);
  const band = depreciationFor(ageYears);
  const crspKes = Math.max(input.crspKes, 0);
  const depreciatedCrspKes = round(crspKes * (1 - band.pct));
  const declaredCifKes = Math.max(input.declaredCifKes, 0);

  const useCrsp = depreciatedCrspKes >= declaredCifKes;
  const customsValueKes = Math.max(depreciatedCrspKes, declaredCifKes);

  const importDutyRate = importDutyRate_(input.bodyType, input.fuel);
  const importDutyKes = round(customsValueKes * importDutyRate);

  const exciseBaseKes = customsValueKes + importDutyKes;
  const exciseRate = exciseRateFor(input.engineCc, input.fuel);
  const exciseKes = round(exciseBaseKes * exciseRate);

  const idfKes = round(customsValueKes * KRA_SCHEDULE.idfRate);
  const rdlKes = round(customsValueKes * KRA_SCHEDULE.rdlRate);
  const vatBaseKes = customsValueKes + importDutyKes + exciseKes + idfKes + rdlKes;
  const vatKes = round(vatBaseKes * KRA_SCHEDULE.vatRate);

  const totalTaxesKes = round(importDutyKes + exciseKes + idfKes + rdlKes + vatKes);

  return {
    crspKes,
    depreciationPct: band.pct,
    depreciationLabel: band.label,
    ageYears,
    depreciatedCrspKes,
    declaredCifKes,
    customsValueKes,
    valuationBasis: useCrsp ? "crsp" : "cif",
    importDutyRate,
    importDutyKes,
    exciseBaseKes,
    exciseRate,
    exciseBand: exciseBandLabel(input.engineCc, input.fuel),
    exciseKes,
    idfKes,
    rdlKes,
    vatBaseKes,
    vatKes,
    totalTaxesKes,
    effectiveRate: customsValueKes > 0 ? totalTaxesKes / customsValueKes : 0,
    schedule: KRA_SCHEDULE.version,
  };
}

function importDutyRate_(bodyType: string, fuel: string) {
  return importDutyRate(bodyType, fuel);
}

/** Fallback CRSP when a unit has no KRA schedule value captured yet. */
export function derivedCrspKes(priceUsd: number, rate: number = KRA_SCHEDULE.rate) {
  return Math.round(priceUsd * rate * 2.1);
}
