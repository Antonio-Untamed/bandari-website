"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "@/components/icons";

export function AdminLoginForm({ hint }: { hint: string | null }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mt-6 p-6">
      <label className="label" htmlFor="passcode">Desk passcode</label>
      <input
        id="passcode"
        type="password"
        autoFocus
        required
        value={passcode}
        onChange={(event) => setPasscode(event.target.value)}
        className="field"
        placeholder="••••••••"
      />
      {error ? (
        <p className="mt-3 rounded-xl border border-clay/30 bg-clay-soft px-4 py-2.5 text-[12.5px] font-medium text-clay">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary mt-4 w-full">
        {pending ? "Signing in…" : "Open the import desk"}
        <ArrowRight className="h-4 w-4" />
      </button>
      {hint ? (
        <p className="mt-3 rounded-xl border border-line bg-sand/60 px-3 py-2 text-[11.5px] text-ink/55">
          Default passcode: <span className="font-mono font-semibold text-forest">{hint}</span> — change
          it by setting the <span className="font-mono">ADMIN_PASSCODE</span> environment variable.
        </p>
      ) : null}
    </form>
  );
}
