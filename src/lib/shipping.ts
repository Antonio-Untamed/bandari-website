export const SHIPPING_STAGES = [
  {
    key: "reserved",
    label: "Order reserved",
    short: "Reserved",
    blurb: "Vehicle held for you and order opened.",
  },
  {
    key: "deposit",
    label: "Deposit confirmed",
    short: "Deposit",
    blurb: "Deposit received, invoice and contract issued.",
  },
  {
    key: "sourced",
    label: "Sourced & inspected",
    short: "Inspection",
    blurb: "JEVIC / pre-shipment inspection completed.",
  },
  {
    key: "export",
    label: "Export docs & booked",
    short: "Export",
    blurb: "Bill of lading issued and vessel slot booked.",
  },
  {
    key: "transit",
    label: "Sailing to Mombasa",
    short: "At sea",
    blurb: "Vehicle is on the water, AIS tracked by our team.",
  },
  {
    key: "arrived",
    label: "Arrived Mombasa",
    short: "Arrived",
    blurb: "Offloaded at Mombasa Port, KPA entry lodged.",
  },
  {
    key: "clearing",
    label: "Clearing & registration",
    short: "Clearing",
    blurb: "Duty paid, KEBS release, NTSA registration.",
  },
  {
    key: "delivered",
    label: "Delivered",
    short: "Delivered",
    blurb: "Handed over with logbook and warranty pack.",
  },
] as const;

export const LAST_STAGE = SHIPPING_STAGES.length - 1;

export function stageLabel(stage: number) {
  return SHIPPING_STAGES[Math.min(Math.max(stage, 0), LAST_STAGE)].label;
}

export function stageShort(stage: number) {
  return SHIPPING_STAGES[Math.min(Math.max(stage, 0), LAST_STAGE)].short;
}

export function stageProgress(stage: number) {
  return Math.round((Math.min(Math.max(stage, 0), LAST_STAGE) / LAST_STAGE) * 100);
}

export function statusTone(stage: number) {
  if (stage >= LAST_STAGE) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (stage >= 4) return "bg-sky-100 text-sky-800 border-sky-200";
  return "bg-amber-100 text-amber-900 border-amber-200";
}

const STAGE_DAYS = [0, 2, 9, 16, 20, 54, 60, 68];

const STAGE_COPY = [
  {
    title: "Order reserved online",
    description:
      "Vehicle held for 72 hours while our import desk confirmed specification, pricing and landed-cost estimate.",
    location: "Nairobi, Kenya",
  },
  {
    title: "Deposit confirmed",
    description:
      "30% deposit received. Proforma invoice, import contract and payment schedule issued to your portal.",
    location: "Nairobi, Kenya",
  },
  {
    title: "Sourced & inspected",
    description:
      "Pre-shipment inspection completed: auction sheet, mileage verification, underbody photos and JEVIC certificate.",
    location: "Origin yard",
  },
  {
    title: "Export documents & sailing booked",
    description:
      "Bill of lading issued, export certificate stamped and RoRo slot confirmed with the carrier.",
    location: "Origin port",
  },
  {
    title: "Sailing to Mombasa",
    description:
      "Vehicle loaded and on the water. Our shipping desk posts weekly AIS position updates here.",
    location: "Indian Ocean",
  },
  {
    title: "Arrived at Mombasa Port",
    description:
      "Offloaded at KPA. Customs entry lodged, duty assessment raised and port storage clock started.",
    location: "Mombasa, Kenya",
  },
  {
    title: "Clearing, registration & plates",
    description:
      "Duty and levies settled, KEBS release secured, NTSA registration completed and number plates fitted.",
    location: "Mombasa → Nairobi",
  },
  {
    title: "Delivered to client",
    description:
      "Handed over with logbook, duplicate keys, warranty pack and a full photo set of your vehicle.",
    location: "Nairobi yard",
  },
];

export type TimelineEvent = {
  stage: number;
  title: string;
  description: string;
  location: string;
  occurredAt: string;
  done: boolean;
};

export function buildTimeline(
  currentStage: number,
  options: { startDate?: Date; originPort?: string; vesselName?: string } = {},
): TimelineEvent[] {
  const start = options.startDate ?? new Date();
  const origin = options.originPort ?? "Yokohama, Japan";

  return STAGE_COPY.map((copy, index) => {
    const date = new Date(start.getTime() + STAGE_DAYS[index] * 86400000);
    const done = index <= currentStage;
    let location = copy.location;
    if (index === 2 || index === 3) location = origin;
    if (index === 4 && options.vesselName) {
      location = `MV ${options.vesselName} · at sea`;
    }
    return {
      stage: index,
      title: copy.title,
      description: copy.description,
      location,
      occurredAt: done ? date.toISOString() : date.toISOString(),
      done,
    };
  });
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDays(days: number, from: Date = new Date()) {
  return new Date(from.getTime() + days * 86400000);
}

