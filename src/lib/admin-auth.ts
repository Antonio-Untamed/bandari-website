import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bandari_admin";

function passcode() {
  return process.env.ADMIN_PASSCODE ?? "bandari2026";
}

function secret() {
  return process.env.ADMIN_SECRET ?? "bandari-autos-kenya-desk";
}

function tokenFor(value: string) {
  return createHash("sha256").update(`${value}::${secret()}`).digest("hex");
}

export function checkPasscode(input: string) {
  const candidate = (input ?? "").trim();
  if (!candidate) return false;
  return candidate === passcode();
}

export function sessionToken() {
  return tokenFor(passcode());
}

export async function isAdmin() {
  const store = await cookies();
  const cookie = store.get(ADMIN_COOKIE)?.value;
  return Boolean(cookie) && cookie === sessionToken();
}

/** Passcode hint shown on the login screen until a custom one is configured. */
export function adminPasscodeHint() {
  return process.env.ADMIN_PASSCODE ? null : passcode();
}
