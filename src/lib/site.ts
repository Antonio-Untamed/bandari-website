export const SITE = {
  name: "Bandari Auto Imports",
  phoneDisplay: "0799 007 101",
  phoneRaw: "0799007101",
  phoneTel: "+254799007101",
  whatsapp: "254799007101",
  whatsappDisplay: "+254 799 007 101",
  email: "desk@bandariautos.co.ke",
  addressNairobi: "Bandari House, Moi Avenue, Nairobi",
  addressMombasa: "KPA Clearing Yard, Changamwe, Mombasa",
} as const;

export function waLink(message: string, number: string = SITE.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT_MESSAGE =
  `Habari ${SITE.name}, I would like to import a vehicle into Kenya. Please share the landed cost and available units.`;

export function waCallbackMessage(input: {
  name: string;
  email?: string;
  phone?: string;
  budget?: string;
  message?: string;
  vehicle?: string;
}) {
  const lines = [
    `*Callback request — ${SITE.name}*`,
    `Name: ${input.name}`,
  ];
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  if (input.email) lines.push(`Email: ${input.email}`);
  if (input.budget) lines.push(`Budget: ${input.budget}`);
  if (input.vehicle) lines.push(`Vehicle: ${input.vehicle}`);
  if (input.message) lines.push(`Request: ${input.message}`);
  lines.push("", "Sent from the Bandari website.");
  return lines.join("\n");
}
