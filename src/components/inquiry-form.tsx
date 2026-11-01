"use client";

import { useState } from "react";
import { SITE, waCallbackMessage, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./site-chrome";

export function InquiryForm({ vehicle }: { vehicle?: string }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [waHref, setWaHref] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const message = waCallbackMessage({ ...form, vehicle });
    const href = waLink(message);
    setWaHref(href);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, message: vehicle ? `${form.message} (Vehicle: ${vehicle})` : form.message }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not send your request.");

      setDone(true);
      // Push the request straight to the desk's WhatsApp.
      const popup = window.open(href, "_blank", "noopener,noreferrer");
      if (!popup) {
        window.location.href = href;
      }
      setForm({ name: "", email: "", phone: "", budget: "", message: "" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-fern/30 bg-white/10 p-6 text-cream backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Sent to WhatsApp
        </span>
        <p className="display mt-3 text-[22px]">Karibu. Your request is on its way.</p>
        <p className="mt-2 text-[13px] leading-relaxed text-cream/70">
          We opened WhatsApp with your details pre-filled for {SITE.whatsappDisplay}. If it did not
          open, tap the button below and press send in WhatsApp.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={waHref} target="_blank" rel="noreferrer" className="btn !bg-[#25D366] !py-2.5 text-[12.5px] !text-white hover:!bg-[#1fb757]">
            <WhatsAppIcon className="h-4 w-4" />
            Open WhatsApp
          </a>
          <button type="button" onClick={() => setDone(false)} className="btn-cream !py-2.5 text-[12px]">
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-cream/20 bg-cream/[0.07] p-5 backdrop-blur sm:p-6"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">
        Request a sourcing call
      </p>
      <p className="display mt-2 text-[22px] text-cream">Tell us what you want to drive</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-cream/50">
        <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
        Requests go straight to our WhatsApp — {SITE.whatsappDisplay}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label !text-cream/50" htmlFor="inquiry-name">Name</label>
          <input
            id="inquiry-name"
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="field"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="label !text-cream/50" htmlFor="inquiry-email">Email</label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label !text-cream/50" htmlFor="inquiry-phone">Phone</label>
          <input
            id="inquiry-phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="field"
            placeholder="0799 007 101"
          />
        </div>
        <div>
          <label className="label !text-cream/50" htmlFor="inquiry-budget">Budget</label>
          <select
            id="inquiry-budget"
            value={form.budget}
            onChange={(event) => update("budget", event.target.value)}
            className="field"
          >
            <option value="">Select budget</option>
            <option value="under-1m">Under KSh 1M landed</option>
            <option value="1-2m">KSh 1M – 2M landed</option>
            <option value="2-4m">KSh 2M – 4M landed</option>
            <option value="4m-plus">KSh 4M+ landed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label !text-cream/50" htmlFor="inquiry-message">What are you after?</label>
          <textarea
            id="inquiry-message"
            rows={2}
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            className="field resize-none"
            placeholder="e.g. 2019+ Prado TX-L under 60,000km, budget KSh 5.5M landed"
          />
        </div>
      </div>
      {error ? <p className="mt-3 text-[12px] font-medium text-amber-200">{error}</p> : null}
      <button type="submit" disabled={pending} className="btn !mt-4 w-full !bg-[#25D366] text-white hover:!bg-[#1fb757]">
        <WhatsAppIcon className="h-4 w-4" />
        {pending ? "Sending…" : "Send request to WhatsApp"}
      </button>
      <p className="mt-2 text-center text-[11px] text-cream/40">
        Saved in our desk and delivered to {SITE.phoneDisplay}. No spam.
      </p>
    </form>
  );
}
